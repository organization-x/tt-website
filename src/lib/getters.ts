// This file hold functions used inside +page.server.ts files and API endpoints.
// All these functions are getters, the setters are in their respective API endpoints

import { prisma } from "$lib/prisma";

import type { Prisma } from "@prisma/client";

export const getUsers = (where: Prisma.UserWhereInput) =>
	prisma.user.findMany({
		where,
		include: { links: true, pinnedProject: true }
	});

export const getProjects = async (where: Prisma.ProjectWhereInput) => {
	// Grab projects using request, if an error occurs, reject
	const projects = await prisma.project
		.findMany({
			where,
			include: { authors: { include: { user: true } } }
		})
		.then((projects) => projects);

	if (!projects) return;

	// Map projects create new objects that includes the authors without extra data
	return projects.map((project) => {
		return {
			...project,
			authors: project.authors.map((author) => {
				return { ...author.user, position: author.position };
			})
		};
	}) as App.ProjectWithAuthors[];
};
