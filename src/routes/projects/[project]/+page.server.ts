import { prisma } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

import type { Project } from "@prisma/client";
import type { PageServerLoad } from "./$types";

// Grab project data using slug, if the project doesn't exist, redirect to the projects page.
export const load: PageServerLoad<{
	project: Project;
	authors: App.ProjectAuthor[];
	previous: string;
}> = async ({ params, request }) => {
	const project = await prisma.project.findUnique({
		where: { url: params.project }
	});

	if (!project) throw redirect(302, "/projects");

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
		project,
		authors,
		previous:
			request.referrer === "about:client" ? "/projects" : request.referrer
	};
};
