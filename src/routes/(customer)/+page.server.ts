import { getProjects, prisma } from "$lib/prisma";

import type { PageServerLoad } from "./$types";

// Grab the author data and descriptions for the 4 selected projects on the landing page as well as
// the user data for the 3 selected developers
export const load: PageServerLoad<{
	projects: App.ProjectWithMetadata[];
	developers: App.Developer[];
}> = async () => {
	const projects = await getProjects({
		url: {
			in: ["hippo2", "ai-camp-bot", "this-website", "ai-on-thumbs"]
		}
	});

	// The reason the getUsers function isn't used here is we want the loading of this
	// page to be super fast and don't want to grab any extra data we don't need
	// TODO: Add top 3 developer's Discord ids to the database and use them here
	const developers = await prisma.user.findMany({
		where: {
			id: {
				in: ["340324858405847042"]
			}
		},
		select: {
			name: true,
			id: true,
			about: true
		}
	});

	return { projects, developers };
};
