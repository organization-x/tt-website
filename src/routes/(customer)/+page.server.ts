import { getProjects, prisma } from "$lib/prisma";

import type { PageServerLoad } from "./$types";

// Grab the author data and descriptions for the 4 selected projects on the landing page as well as
// the user data for the 3 selected developers. All projects with their URL's are grabbed for generating
// structured data for SEO
export const load: PageServerLoad<{
	projects: App.ProjectWithMetadata[];
	developers: App.Developer[];
	items: string[];
}> = async () => {
	return {
		projects: await getProjects({
			url: {
				in: [
					"hippo2",
					"ai-camp-bot",
					"team-tomorrow-website",
					"ai-on-thumbs"
				]
			}
		}),

		developers: await prisma.user.findMany({
			where: {
				homepage: true
			},
			select: {
				name: true,
				team: true,
				id: true,
				about: true,
				softSkills: true,
				techSkills: true
			}
		}),

		items: (
			await prisma.project.findMany({
				select: { url: true },
				orderBy: { date: "desc" }
			})
		).map(({ url }) => url)
	};
};
