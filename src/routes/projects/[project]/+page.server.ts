import { prisma } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

import type { Project } from "@prisma/client";
import type { PageServerLoad } from "./$types";

// Grab project data using slug, if the project doesn't exist, redirect to the projects page
export const load: PageServerLoad<Project | void> = async ({ params }) => {
	await prisma.project
		.findUnique({ where: { url: params.project } })
		.then((project) => {
			if (!project) throw redirect(302, "/projects");
			return project;
		})
		.catch(() => {
			throw redirect(302, "/projects"); // On error just assume the project doesn't exist
		});
};
