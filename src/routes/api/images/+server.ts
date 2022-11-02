import Sharp from "sharp";
import { error } from "@sveltejs/kit";

import { prisma, userAuth } from "$lib/prisma";
import { env } from "$env/dynamic/private";

import type { RequestHandler } from "./$types";

// Request handlers for interacting with Cloudlare images

// Update a user's avatar/banner or a project's banner
// * INPUT: FormData: file, type, id
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	// If the session token is invalid, throw unauthorized
	if (!user) throw error(401, "Unauthorized");

	try {
		const data = await request.formData();

		let id = user.id;
		let type = data.get("type") as string;

		// If the data includes an invalid type or the image size is greater than 1MB throw a bad request
		if (
			(type !== "user-avatar" &&
				type !== "user-banner" &&
				type !== "project-banner") ||
			(data.get("file") as File).size >= 1048576
		)
			throw error(400, "Bad Request");

		// Remove the type since we don't want it in the Cloudflare request
		data.delete("type");

		// If it's a user avatar or banner remove the user prefix and set the id
		if (type === "user-avatar" || type === "user-banner")
			(type = type.split("-")[1]) && data.set("id", `${type}-${user.id}`);
		else {
			// Otherwise check if the user owns the project they're updating and set the type to
			// banner since it is the only type for projects. Also update the ID to be the project id

			// TODO: Finish project color theming
			// Sharp(Buffer.from(await (data.get("file") as Blob).arrayBuffer()))
			// 	.toColorspace("srgb")
			// 	.toFormat("raw")
			// 	.toBuffer((err, buffer, info) => {
			// 		if (err) throw error(400, "Bad Request");

			// 		// Used for tracking iterators in the first loop then the biggest value in the second
			// 		let int = 0;

			// 		// Based off of the image size, create a pixel color interval. So every interval pixels
			// 		// will be checked for a color
			// 		const interval = Math.log10(info.width * info.height) * 10;

			// 		// Store rgb values categorized by their closest color
			// 		const rgbs: number[][] = [];

			// 		// Read the data and get the array of seen colors
			// 		buffer.forEach((byte, i, bytes) => {
			// 			if (int === 3) {
			// 				int = 0;

			// 				// Since this is sRgb, every 3 bytes is a pixel
			// 				const pixel = i / 3;

			// 				if (Math.floor(pixel % interval) !== 0) return;

			// 				rgbs.push([bytes[i - 3], byte, bytes[i - 2]]);
			// 			} else int++;
			// 		});
			// 	});

			id = data.get("id") as string;

			// Check if the project exists
			const project = await prisma.project.findUnique({
				where: { id }
			});

			if (!project) throw error(400, "Bad Request");

			// Check if the user owns the project
			if (project.ownerId !== user.id) throw error(401, "Unauthorized");

			type = "banner";

			data.set("id", `${type}-${id}`);
		}

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

		return new Response(undefined, { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
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

		// If the image size is greater than 1MB throw a bad request
		if ((data.get("file") as File).size >= 1048576)
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
		).result.id as string;

		// We don't add it to the project here, instead it is stored locally until the content has
		// been saved by the user. If the user doesn't save with the newly uploaded images, they will be
		// deleted from Cloudflare

		return new Response(JSON.stringify({ id }), { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};
