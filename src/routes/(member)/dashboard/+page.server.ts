import { getKudos, getProjects } from "$lib/prisma";

import type { PageServerLoad } from "./$types";

// Grab the users projects when they're on the main dashboard page
export const load: PageServerLoad<{
	projects: App.ProjectWithMetadata[] | undefined;
	kudos: App.Kudo[];
}> = async ({ parent }) => {
	const user = await parent();

	const projects = await getProjects({
		ownerId: user.id
	});

	return { projects, kudos: await getKudos(user.id) };
};
