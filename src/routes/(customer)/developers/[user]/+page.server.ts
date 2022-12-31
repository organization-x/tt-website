import { redirect } from "@sveltejs/kit";
import { getProjects } from "$lib/prisma";
import { getKudos, prisma } from "$lib/prisma";

import type { PageServerLoad } from "./$types";
import type { User, Endorsement } from "@prisma/client";

// Grab user data using slug, if the user doesn't exist, redirect to the developers page.
// The reason the typing on this is so weird is because we are selecting only specific properties of each
// object and there isn't an easy way to type it
export const load: PageServerLoad<{
	userPage: User & {
		links: App.UserLinks;
		pinnedProject?: App.ProjectWithMetadata;
		endorsementsReceived: (Endorsement & {
			from: Pick<User, "id" | "name" | "url">;
		})[];
	};
	projects: App.ProjectWithMetadata[];
	kudos: App.Kudo[];
}> = async ({ params }) => {
	const userPage = (await prisma.user.findUnique({
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

	if (!userPage) throw redirect(302, "/developers");

	const projects = await getProjects({
		OR: [
			{
				ownerId: userPage.id
			},
			{
				authors: {
					some: {
						userId: userPage.id
					}
				}
			}
		],
		visible: true
	});

	const startDate = new Date();
	startDate.setFullYear(startDate.getFullYear() - 1);

	return {
		userPage,
		projects,
		kudos: (
			await getKudos(
				userPage.id,
				startDate.toISOString(),
				new Date().toISOString(),
				"personal"
			)
		).kudos
	};
};
