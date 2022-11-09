import { redirect } from "@sveltejs/kit";

import { prisma } from "$lib/prisma";

import type { User } from "@prisma/client";
import type { PageServerLoad } from "./$types";

// Grab the users projects when they're on the main dashboard page
export const load: PageServerLoad<{
	homepage: User[];
}> = async ({ parent }) => {
	const user = await parent();

	// If the user is not an admin redirect them back to the dashboard
	if (user.role !== "Admin") throw redirect(302, "/dashboard");

	// Grab the current users on the homepage
	return {
		homepage: await prisma.user.findMany({
			where: {
				homepage: true
			}
		})
	};
};
