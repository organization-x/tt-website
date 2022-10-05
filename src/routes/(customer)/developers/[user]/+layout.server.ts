import { prisma } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";
import { getProjects } from "$lib/getters";

import type { User } from "@prisma/client";
import type { LayoutServerLoad } from "./$types";

// Grab project data using slug, if the project doesn't exist, redirect to the projects page.
export const load: LayoutServerLoad<{
	user: User & {
		links: App.UserLinks;
		pinnedProject?: App.ProjectWithMetadata;
	};
	projects: App.ProjectWithMetadata[];
}> = async ({ params }) => {
	const user = (await prisma.user.findUnique({
		where: { url: params.user },
		include: {
			links: true,
			pinnedProject: {
				include: {
					authors: {
						select: {
							position: true,
							user: true
						}
					}
				}
			}
		}
	})) as User & {
		links: App.UserLinks;
		pinnedProject?: App.ProjectWithMetadata;
	};

	if (!user) throw redirect(302, "/developers");

	const projects = await getProjects({ url: user.url });

	return { user, projects };
};
