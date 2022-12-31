import { error } from "@sveltejs/kit";
import { getKudos, userAuth } from "$lib/prisma";

import type { RequestHandler } from "./$types";

// Request handler for grabbing kudos data, essentially a proxy for the getKudos function since prisma queries have to be made

// Grab kudos data
// * INPUT: id=string, startDate=string, endDate=string, mode=global|personal, page?=number
// * OUTPUT: UserWithMetadata[]
export const GET: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	const query = new URL(request.url).searchParams;
	const mode = query.get("mode") as "global" | "personal" | null;

	// If no mode or an incorrect mode was given, throw a bad request
	if (!mode || (mode !== "global" && mode !== "personal"))
		throw error(400, "Bad Request");

	// If the mode is global and there is no user or the user is not an admin, throw unauthorized
	if ((!user || user.role !== "Admin") && mode === "global")
		throw error(401, "Unauthorized");

	try {
		const page = query.get("page");

		return new Response(
			JSON.stringify(
				await getKudos(
					query.get("id")!,
					query.get("startDate")!,
					query.get("endDate")!,
					mode,
					page ? parseInt(page) : 1
				)
			),
			{ status: 200 }
		);
	} catch {
		throw error(400, "Bad Request");
	}
};
