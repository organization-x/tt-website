import { getProjects } from "$lib/getters";
import { prisma } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

// Grab project data using slug, if the project doesn't exist, redirect to the projects page.
export const load: LayoutServerLoad = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: { url: params.user },
		include: {
			links: true,
			pinnedProject: {
				include: {
					authors: {
						select: {
							user: true,
							position: true
						}
					}
				}
			}
		}
	});

	if (!user) throw redirect(302, "/developers");

	const projects = getProjects({ url: user.url });

	return { user, projects };
};
