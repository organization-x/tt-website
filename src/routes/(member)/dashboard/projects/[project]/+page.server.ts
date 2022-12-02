import { redirect } from "@sveltejs/kit";

import { getProjects } from "$lib/prisma";

import type { PageServerLoad } from "./$types";

// Grab project data using slug, if the project doesn't exist, go back to the users project dashboard.
export const load: PageServerLoad<{
	project: App.ProjectWithMetadata;
}> = async ({ params, parent }) => {
	const user = await parent();

	// Grab the project usning the slug and also matching the owner ID.
	// Should only be one project since the slug is unique
	const project = await getProjects({
		url: params.project,

		...(user.role === "Admin"
			? {}
			: {
					OR: [
						{ ownerId: user.id },
						{ authors: { some: { userId: user.id } } }
					]
			  })
	});

	if (!project || !project.length) throw redirect(302, "/dashboard/projects");

	return { project: project[0] };
};
