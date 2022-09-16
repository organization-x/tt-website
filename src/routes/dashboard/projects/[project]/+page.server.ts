import { prisma } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import type { Project, User } from "@prisma/client";

// Grab project data using slug, if the project doesn't exist, go back to the users project dashboard.
export const load: PageServerLoad<{
	user: User;
	project: Project;
	authors: App.ProjectAuthor[];
}> = async ({ locals, cookies, params }) => {
	// If no session is present, redirect to login
	if (!locals.session) throw redirect(302, "/login");

	const session = prisma.session.findUnique({
		where: { token: locals.session }
	});

	// If there isn't a session, the token is old or invalid, redirect to login and remove the
	// current session cookie and set the local to null
	if (!(await session)) {
		locals.session = null;
		cookies.delete("session");
		throw redirect(302, "/login");
	}

	const user = (await session.user())!;

	// Grab the project usning the slug and also matching the owner ID
	const project = await prisma.project.findFirst({
		where: { url: params.project, ownerId: user.id }
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
		user,
		project,
		authors
	};
};
