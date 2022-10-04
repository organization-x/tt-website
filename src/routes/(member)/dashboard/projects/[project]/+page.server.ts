import { redirect } from "@sveltejs/kit";

import { getProjects } from "$lib/getters";

import type { PageServerLoad } from "./$types";

// Grab project data using slug, if the project doesn't exist, go back to the users project dashboard.
export const load: PageServerLoad<{
	project: App.ProjectWithAuthors;
}> = async ({ params, parent }) => {
	const user = await parent();

	// Grab the project usning the slug and also matching the owner ID.
	// Should only be one project since the slug is unique
	const project = await getProjects({
		url: params.project,
		ownerId: user.id
	});

	if (!project) throw redirect(302, "/dashboard/projects");

	return { project: project[0] };
};
