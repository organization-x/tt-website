// This file hold functions used inside +page.server.ts files and API endpoints.
// All these functions are getters, the setters are in their respective API endpoints

import { prisma } from "$lib/prisma";

import type { Prisma } from "@prisma/client";

export const getUsers = async (where: Prisma.UserWhereInput) =>
	await prisma.user.findMany({ where });

export const getProjects = (where: Prisma.ProjectWhereInput) => {
	return new Promise<App.ProjectWithAuthors[]>(async (res, rej) => {
		// Grab projects using request, if an error occurs, reject
		const projects = await prisma.project
			.findMany({ where })
			.then((projects) => projects)
			.catch(rej);

		if (!projects) return;

		// For each project create a new object that includes the authors
		res(
			await Promise.all(
				projects.map(async (project) => {
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

					return { ...project, authors };
				})
			)
		);
	});
};
