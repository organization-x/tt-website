import { error } from "@sveltejs/kit";
import { prisma, checkSession } from "$lib/prisma";

import type { Prisma } from "@prisma/client";
import type { RequestHandler } from "./$types";

// Request handlers for managing project data in prisma, it uses the users session token to verify the API call

// Update project information
// * INPUT: ProjectUpdateRequest
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const session = await checkSession(locals);

	// If the session token is invalid, throw unauthorized
	if (!session) throw error(401, "Unauthorized");

	// Parse data or throw bad request if it isn't valid json
	const data: App.ProjectUpdateRequest = await request
		.json()
		.then((data) => data)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	// If the token isn't the same as for the user they are updating, throw unauthorized
	if (data.project.ownerId !== session.userId)
		throw error(401, "Unauthorized");

	// Input validation
	if (
		data.project.title.length < 1 ||
		data.project.title.length > 50 ||
		data.project.description.length < 1 ||
		data.project.description.length > 300 ||
		data.project.skills.length < 2 ||
		data.authors.length < 1 ||
		!data.authors.some((author) => author.id === data.project.ownerId)
	)
		throw error(400, "Bad Request");

	// Check if project has the same url (so title) as another project
	if (
		await prisma.project.findFirst({
			where: { url: data.project.url, id: { not: data.project.id } }
		})
	)
		throw error(400, "SAME_TITLE");

	// Check if content is valid json
	let content: Prisma.InputJsonValue;
	try {
		content = JSON.parse(
			JSON.stringify(data.project.content)
		) as Prisma.InputJsonValue;
	} catch {
		throw error(400, "Bad Request");
	}

	// Update the project
	await prisma.project
		.update({
			where: data.where,
			data: {
				...data.project,
				content
			}
		})
		.catch(() => {
			throw error(400, "Bad Request");
		});

	// Update the authors, fist by deleting all current authors
	await prisma.projectAuthor.deleteMany({
		where: { projectId: data.where.id }
	});

	// Then add all the authors that were provided in the updated data.
	// The reason for this is it's faster than comparing the two arrays
	// and surgically updating the authors.
	await prisma.projectAuthor.createMany({
		data: data.authors.map((author) => ({
			projectId: data.where.id!,
			userId: author.id,
			position: author.position
		}))
	});

	return new Response(undefined, { status: 200 });
};

// Search for projects, otherwise a +page.server.ts should be used
// * INPUT: ProjectSearchRequest
// * OUTPUT: Project[]
export const POST: RequestHandler = async ({ request }) => {
	const data: App.ProjectSearchRequest = await request.json();

	// Grab users using request, if an error occurs throw a bad request
	const projects = await prisma.project
		.findMany({ where: data.where })
		.then((projects) => projects)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	return new Response(JSON.stringify(projects), { status: 200 });
};
