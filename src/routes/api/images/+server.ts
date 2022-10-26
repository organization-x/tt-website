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

		// If the data includes an invalid type, throw bad request
		if (type !== "avatar" && type !== "banner")
			throw error(400, "Bad Request");

		// Remove the type since we don't want it in the Cloudflare request
		data.delete("type");

		// Update the image with the Cloudflare Images API
		await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1/${type}-${user.id}`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
				},
				body: data
			}
		)
			.then((res) => res.json())
			.then((res) => console.log(res));

		return new Response(undefined, { status: 200 });
	} catch (e) {
		console.log(e);
		throw error(400, "Bad Request");
	}
};

export const GET: RequestHandler = async () => {
	console.log(
		await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1?per_page=100`
		).then((res) => res.json())
	);

	return new Response(undefined, { status: 200 });
};
