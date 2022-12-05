import Sharp from "sharp";
import { error } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import { prisma, userAuth } from "$lib/prisma";

import type { RequestHandler } from "./$types";

// Request handlers for interacting with Cloudlare images

// Update a user's avatar/banner or a project's banner
// * INPUT: FormData: file, type, id
// * OUTPUT: ImageUploadResponse
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	// If the session token is invalid, throw unauthorized
	if (!user) throw error(401, "Unauthorized");

	const data = await request
		.formData()
		.then((data) => data)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	const id = data.get("id") as string;

	let theme: string;
	let type = data.get("type") as string;

	// If the data includes an invalid type, if there's no ID provided, or if the image size is greater than
	// 2MB then throw a bad request
	if (
		!id ||
		(type !== "user-avatar" &&
			type !== "user-banner" &&
			type !== "project-banner") ||
		(data.get("file") as File).size >= 2000000
	)
		throw error(400, "Bad Request");

	// Remove the type since we don't want it in the Cloudflare request
	data.delete("type");

	// If it's a user avatar or banner remove the user prefix and set the id
	if (type === "user-avatar" || type === "user-banner") {
		// Check if user being edited matches or the editor is an admin
		if (
			(type === "user-avatar" || type === "user-banner") &&
			id !== user.id &&
			user.role !== "Admin"
		)
			throw error(401, "Unauthorized");

		type = type.split("-")[1];
	} else {
		// Check if the project exists
		const project = await prisma.project.findUnique({
			where: { id }
		});

		if (!project) throw error(400, "Bad Request");

		// Check if the user owns the project or is an admin
		if (project.ownerId !== user.id && user.role !== "Admin")
			throw error(401, "Unauthorized");

		const buffer = await Sharp(
			Buffer.from(await (data.get("file") as Blob).arrayBuffer())
		)
			.resize(300, 300)
			.toFormat("raw")
			.removeAlpha()
			.toBuffer();

		// Store the pixels relative to a range set by another pixel. For example, a 255 255 255 pixel
		// would set a range for each channel like this: r: 250-255, g: 250-255, b: 250-255, any pixel
		// then inside that range preceding it will be grouped along with it
		let colors = [];

		// Store the mean of every channel for every pixel
		const mean = { r: 0, g: 0, b: 0 };

		// Iterate through the bytes and figure out if the pixel needs to create a new range
		// or join an already existing one
		for (let i = 0; i < buffer.length; i += 3) {
			// Get R G B values from buffer
			const { r, g, b } = {
				r: buffer[i],
				g: buffer[i + 1],
				b: buffer[i + 2]
			};

			// Figure out if this pixel belongs in an existing range, if so, get the index of it
			const index = colors.findIndex(
				({ r: [rMin, rMax], g: [gMin, gMax], b: [bMin, bMax] }) =>
					r >= rMin &&
					r <= rMax &&
					g >= gMin &&
					g <= gMax &&
					b >= bMin &&
					b <= bMax
			);

			// Either add this pixel to the range's values or create a new range
			index !== -1
				? colors[index].values.push({ r, g, b })
				: colors.push({
						r: [r - 5, r + 5],
						g: [g - 5, g + 5],
						b: [b - 5, b + 5],
						values: [{ r, g, b }]
				  });

			// Add to the total for mean
			mean.r += r;
			mean.g += g;
			mean.b += b;
		}

		// Get the mean of each channel
		mean.r = Math.round(mean.r / (buffer.length / 3));
		mean.g = Math.round(mean.g / (buffer.length / 3));
		mean.b = Math.round(mean.b / (buffer.length / 3));

		// Get the range with the most values and set colors to those values
		{
			let longest = 0;
			for (const color of colors) {
				if (color.values.length > longest)
					(longest = color.values.length) && (colors = color.values);
			}
		}

		// Grab the color closest to the mean of all colors
		let result = colors[0] as { r: number; g: number; b: number };
		for (const color of colors as { r: number; g: number; b: number }[]) {
			if (
				color.r - mean.r < result.r - mean.r &&
				color.g - mean.g < result.g - mean.g &&
				color.b - mean.b < result.b - mean.b
			)
				result = color;
		}

		theme =
			result.r.toString(16).padStart(2, "0") +
			result.g.toString(16).padStart(2, "0") +
			result.b.toString(16).padStart(2, "0");

		await prisma.project.update({ where: { id }, data: { theme } });

		type = "banner";
	}

	// Append the ID of the user or project along with the appropriate type
	data.set("id", `${type}-${id}`);

	try {
		// First delete the image from Cloudflare
		await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1/${type}-${id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
				}
			}
		);

		// Then upload the new image to Cloudflare
		await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
				},
				body: data
			}
		);
	} catch {
		throw error(400, "Bad Request");
	}

	return new Response(
		type === "banner" ? JSON.stringify({ theme: theme! }) : undefined,
		{ status: 200 }
	);
};

// Upload an image for a project's content
// * INPUT: FormData: file, id
// * OUTPUT: ImageUploadResponse
export const PUT: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	// If the session token is invalid, throw unauthorized
	if (!user) throw error(401, "Unauthorized");

	try {
		const data = await request.formData();

		// Check if the project exists and if the user owns it
		const project = await prisma.project.findFirst({
			where: {
				id: data.get("id") as string,
				ownerId: user.id
			}
		});

		if (!project) throw error(400, "Bad Request");

		// If the image size is greater than 2MB throw a bad request
		if ((data.get("file") as File).size >= 2000000)
			throw error(400, "Bad Request");

		// Set the ID to include the project ID
		data.set("id", `${project.id}-${new Date().toISOString()}`);

		// Upload the image to Cloudflare
		const id = (
			await fetch(
				`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
					},
					body: data
				}
			).then((res) => res.json())
		).result.id;

		// We don't add it to the project here, instead it is stored locally until the content has
		// been saved by the user. If the user doesn't save with the newly uploaded images, they will be
		// deleted from Cloudflare

		return new Response(JSON.stringify({ id }), { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};
