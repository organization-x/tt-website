import { redirect } from "@sveltejs/kit";
import { userAuth } from "$lib/prisma";

import { getProjects } from "$lib/getters";

import type { PageServerLoad } from "./$types";
import type { Project, User } from "@prisma/client";

// Grab project data using slug, if the project doesn't exist, go back to the users project dashboard.
export const load: PageServerLoad<{
	user: User;
	project: Project;
}> = async ({ locals, cookies, params }) => {
	const props = await userAuth(locals);

	if (!props) {
		locals.session = null;
		cookies.delete("session");
		throw redirect(302, "/login");
	}

	// Grab the project usning the slug and also matching the owner ID.
	// Should only be one project since the slug is unique
	const project = await getProjects({
		url: params.project,
		ownerId: props.user.id
	}).then((projects) => {
		if (projects.length) return projects[0];
		else throw redirect(302, "/dashboard/projects");
	});

	return {
		user: props.user,
		project
	};
};
