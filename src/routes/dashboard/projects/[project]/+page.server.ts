import { redirect } from "@sveltejs/kit";
import { grabUser, prisma } from "$lib/prisma";

import type { PageServerLoad } from "./$types";
import type { Project, User } from "@prisma/client";

// Grab project data using slug, if the project doesn't exist, go back to the users project dashboard.
export const load: PageServerLoad<{
	user: User;
	project: Project;
	authors: App.ProjectAuthor[];
}> = async ({ locals, cookies, params }) => {
	const props = await grabUser(locals);

	if (!props) {
		locals.session = null;
		cookies.delete("session");
		throw redirect(302, "/login");
	}

	// Grab the project usning the slug and also matching the owner ID
	const project = await prisma.project.findFirst({
		where: { url: params.project, ownerId: props.user.id }
	});

	if (!project) throw redirect(302, "/dashboard/projects");

	// Get project authors, should not error since every project should have at least one author
	const projectAuthors = await prisma.projectAuthor.findMany({
		where: { projectId: project.id }
	});

	// Get the actual user data for each author and add their role onto it
	const authors = await Promise.all(
		projectAuthors.map(async (author) => ({
			...(await prisma.user.findUnique({
				where: { id: author.userId }
			}))!,
			position: author.position
		}))
	);

	return {
		user: props.user,
		project,
		authors
	};
};
