import { error } from "@sveltejs/kit";

import { prisma, userAuth } from "$lib/prisma";
import { env } from "$env/dynamic/private";

import type { RequestHandler } from "./$types";

// Request handler for updating a user's avatar/banner and a project's banner

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

		// If the data includes an invalid type or the image size is greater than 1MB throw bad request
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
					Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`,
					"Cache-Control": "max-age=0"
				},
				body: data
			}
		);

		return new Response(undefined, { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};
