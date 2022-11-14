import { redirect } from "@sveltejs/kit";

import { prisma } from "$lib/prisma";

import type { PageServerLoad } from "./$types";

// Grab the user that the admin is editing, if the logged in user
// is the same as the user being edited, redirect to the profile editor
export const load: PageServerLoad<{
	pageUser: App.UserWithMetadata;
}> = async ({ params, parent }) => {
	const user = await parent();

	if (user.url === params.user) throw redirect(302, "/dashboard/profile");

	const pageUser = (await prisma.user.findUnique({
		where: { url: params.user },
		include: {
			links: {
				select: {
					userId: false,
					Devto: true,
					Facebook: true,
					GitHub: true,
					LinkedIn: true,
					Twitter: true,
					Website: true
				}
			},
			pinnedProject: true,
			endorsementsReceived: true
		}
	})) as App.UserWithMetadata;

	if (!pageUser) throw redirect(302, "/dashboard/users");

	return { pageUser };
};
