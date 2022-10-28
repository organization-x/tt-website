import { prisma } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";
import { getProjects } from "$lib/prisma";

import type { User, Endorsement } from "@prisma/client";
import type { LayoutServerLoad } from "./$types";

// Grab project data using slug, if the project doesn't exist, redirect to the projects page.
// The reason the typing on this is so weird is because we are selecting only specific properties of each
// object and there isn't an easy way to type it
export const load: LayoutServerLoad<{
	user: User & {
		links: App.UserLinks;
		pinnedProject?: App.ProjectWithMetadata;
		endorsementsReceived: (Endorsement & {
			from: Pick<User, "id" | "name" | "url">;
		})[];
	};
	projects: App.ProjectWithMetadata[];
	endorserId: string | null;
}> = async ({ locals, params }) => {
	const user = (await prisma.user.findUnique({
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
			pinnedProject: {
				include: {
					authors: {
						select: {
							position: true,
							user: true
						}
					}
				}
			},
			endorsementsReceived: {
				include: {
					from: {
						select: {
							id: true,
							name: true,
							url: true
						}
					}
				}
			}
		}
	})) as User & {
		links: App.UserLinks;
		pinnedProject?: App.ProjectWithMetadata;
		endorsementsReceived: (Endorsement & {
			from: Pick<User, "id" | "name" | "url">;
		})[];
	};

	if (!user) throw redirect(302, "/developers");

	const projects = await getProjects({ ownerId: user.id });

	let endorserId: string | null = null;

	// If the user accesing this profile page is permitted to endorse, grab their id
	if (locals.session) {
		const sesh = await prisma.session.findUnique({
			where: { token: locals.session },
			include: {
				user: {
					select: {
						id: true,
						role: true
					}
				}
			}
		});

		sesh && sesh.user.role !== "User" && (endorserId = sesh.user.id);
	}

	return {
		user,
		projects,
		endorserId
	};
};
