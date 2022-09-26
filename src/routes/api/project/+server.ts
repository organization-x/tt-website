import { error } from "@sveltejs/kit";
import { getProjects } from "$lib/getters";
import { prisma, checkSession, userAuth } from "$lib/prisma";

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

	// Grab the project from the database for validation
	const project = await prisma.project.findUnique({
		where: data.where
	});

	if (!project) throw error(400, "Bad Request");

	// If the token isn't the same as for the user they are updating, throw unauthorized
	if (project.ownerId !== session.userId) throw error(401, "Unauthorized");

	// Input validation
	if (
		(data.project.title &&
			(data.project.title.length < 1 ||
				data.project.title.length > 50)) ||
		(data.project.description &&
			(data.project.description.length < 1 ||
				data.project.description.length > 300)) ||
		(data.project.skills && data.project.skills.length < 2) ||
		(data.authors &&
			(data.authors.length < 1 ||
				!data.authors.some((author) => author.id === project.ownerId)))
	)
		throw error(400, "Bad Request");

	let url: string | undefined;

	// If the title is being changed, do some more input validation
	if (data.project.title) {
		// Create a url out of the title if it exists
		url = data.project.title.trim().replaceAll(" ", "-").toLowerCase();

		// Check if project has the same url (so title) as another project
		if (
			await prisma.project.findFirst({
				where: { url, id: { not: project.id } }
			})
		)
			throw error(400, "SAME_TITLE");
	}

	// Check if content is valid json
	let content: Prisma.InputJsonValue | undefined;
	if (data.project.content) {
		try {
			content = JSON.parse(
				JSON.stringify(data.project.content)
			) as Prisma.InputJsonValue;
		} catch {
			throw error(400, "Bad Request");
		}
	}

	// Update the project
	await prisma.project
		.update({
			where: data.where,
			data: {
				url,
				title: data.project.title,
				description: data.project.description,
				theme: data.project.theme,
				date: data.project.date,
				skills: data.project.skills,
				content,
				visible: data.project.visible
			}
		})
		.catch(() => {
			throw error(400, "Bad Request");
		});

	if (data.authors) {
		// Update the authors, fist by deleting all current authors
		await prisma.projectAuthor
			.deleteMany({
				where: { projectId: project.id }
			})
			.catch(() => {
				throw error(400, "Bad Request");
			});

		// Then add all the authors that were provided in the updated data.
		// The reason for this is it's faster than comparing the two arrays
		// and surgically updating the authors.
		await prisma.projectAuthor
			.createMany({
				data: data.authors.map((author) => ({
					projectId: project.id,
					userId: author.id,
					position: author.position
				}))
			})
			.catch(() => {
				throw error(400, "Bad Request");
			});
	}

	return new Response(JSON.stringify({ url }), { status: 200 });
};

// Search for projects, otherwise a +page.server.ts should be used
// * INPUT: ProjectSearchRequest
// * OUTPUT: ProjectWithAuthors[]
export const POST: RequestHandler = async ({ request }) => {
	const data: App.ProjectSearchRequest = await request.json();

	const projects = await getProjects(data.where)
		.then((projects) => projects)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	return new Response(JSON.stringify(projects), { status: 200 });
};

// Create a new project
// * INPUT: None
// * OUTPUT: String (url)
export const PUT: RequestHandler = async ({ locals }) => {
	const props = await userAuth(locals);

	if (!props) throw error(401, "Unauthorized");

	// Check for other projects and postfix this one
	const postfix = await prisma.project
		.findMany({
			where: {
				url: {
					startsWith: `untitled-${props.user.id}-`
				},
				ownerId: props.user.id
			}
		})
		.then((projects) => {
			let biggest = 0;

			projects.forEach((project) => {
				try {
					const int = Number.parseInt(project.url.split("-")[2]);
					int > biggest && (biggest = int);
				} catch {
					return;
				}
			});

			return biggest + 1;
		})
		.catch(() => {
			throw error(500, "Internal Server Error");
		});

	// Create the project
	const project = await prisma.project
		.create({
			data: {
				url: `untitled-${props.user.id}-${postfix}`,
				title: `Untitled-${props.user.id}-${postfix}`,
				description: "A super cool untitled project!",
				theme: "3B84D6",
				date: new Date(),
				skills: ["Python", "Pytorch"],
				ownerId: props.user.id,
				content: { type: "doc", content: [{ type: "paragraph" }] }
			}
		})
		.catch((e) => {
			console.log(e);
			throw error(400, "Bad Request");
		});

	// Add the owner as an author
	await prisma.projectAuthor
		.create({
			data: {
				userId: props.user.id,
				projectId: project.id,
				position: "Designer" // Designers the default since it's the first in the options list
			}
		})
		.catch(() => {
			throw error(500, "Internal Server Error");
		});

	return new Response(JSON.stringify({ url: project.url }), { status: 200 });
};

// Delete a project
// * INPUT: ProjectDeleteRequest
// * OUTPUT: None
export const DELETE: RequestHandler = async ({ locals, request }) => {
	const props = await userAuth(locals);

	if (!props) throw error(401, "Unauthorized");

	const data: App.ProjectDeleteRequest = await request.json();

	// Check if the project exists
	const project = await prisma.project
		.findUnique({ where: { id: data.id } })
		.then((project) => project)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	if (!project) throw error(400, "Bad Request");

	// Check if the user owns the project
	if (project.ownerId !== props.user.id) throw error(401, "Unauthorized");

	// Delete all authors associated with the project
	await prisma.projectAuthor
		.deleteMany({ where: { projectId: data.id } })
		.catch(() => {
			throw error(500, "Internal Server Error");
		});

	// Delete the project
	await prisma.project
		.delete({
			where: { id: data.id }
		})
		.catch(() => {
			throw error(500, "Internal Server Error");
		});

	return new Response(undefined, { status: 200 });
};
