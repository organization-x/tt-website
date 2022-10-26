import { error } from "@sveltejs/kit";

import { userAuth } from "$lib/prisma";
import { env } from "$env/dynamic/private";

import type { RequestHandler } from "./$types";

// Request handler for updating a user's avatar/banner and a project's banner

// * INPUT: FormData
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	// If the session token is invalid, throw unauthorized
	if (!user) throw error(401, "Unauthorized");

	try {
		const data = await request.formData();

		const type = data.get("type") as string;

		// If the data includes an invalid type or the image size is greater than 1MB throw bad request
		if (
			(type !== "avatar" && type !== "banner") ||
			(data.get("file") as File).size >= 1048576
		)
			throw error(400, "Bad Request");

		// Remove the type since we don't want it in the Cloudflare request
		data.delete("type");

		// Add the user ID and type for image identification
		data.set("id", `${type}-${user.id}`);

		// First delete the image from Cloudflare
		await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1/${type}-${user.id}`,
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
