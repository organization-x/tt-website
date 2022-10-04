import { error } from "@sveltejs/kit";
import { getProjects } from "$lib/getters";
import { prisma, userAuth } from "$lib/prisma";

import type { Prisma } from "@prisma/client";
import type { RequestHandler } from "./$types";

// Request handlers for managing project data in prisma, it uses the users session token to verify the API call

// Update project information
// * INPUT: ProjectUpdateRequest
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	// If the session token is invalid, throw unauthorized
	if (!user) throw error(401, "Unauthorized");

	// Parse data or throw bad request if it isn't valid json
	const data: App.ProjectUpdateRequest = await request
		.json()
		.then((data) => data)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	// Grab the project from the database for validation
	const project = await prisma.project.findUnique({
		where: data.where,
		include: { pinnedBy: true }
	});

	if (!project) throw error(400, "Bad Request");

	// If the token isn't the same as for the user they are updating, throw unauthorized
	if (project.ownerId !== user.id) throw error(401, "Unauthorized");

	// Input validation
	if (
		(data.project.title &&
			(data.project.title.length < 1 ||
				data.project.title.length > 50)) ||
		(data.project.description &&
			(data.project.description.length < 1 ||
				data.project.description.length > 300)) ||
		(data.project.skills && data.project.skills.length < 2) ||
		(data.project.authors &&
			(data.project.authors.length < 1 ||
				!data.project.authors.some(
					(author) => author.id === project.ownerId
				)))
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
				visible: data.project.visible,
				authors: data.project.authors
					? {
							deleteMany: {},
							createMany: {
								data: data.project.authors.map((author) => ({
									userId: author.id,
									position: author.position
								}))
							}
					  }
					: undefined
			}
		})
		.catch(() => {
			throw error(400, "Bad Request");
		});

	return new Response(JSON.stringify({ url }), { status: 200 });
};

// Search for projects, otherwise a +page.server.ts should be used
// * INPUT: ProjectSearchRequest
// * OUTPUT: ProjectWithAuthors[]
export const POST: RequestHandler = async ({ request }) => {
	const data: App.ProjectSearchRequest = await request.json();

	const projects = await getProjects(data.where);

	if (!projects) throw error(400, "Bad Request");

	// Sort projects by most recently updated
	projects.sort((p, n) => (p.date.getDate() < n.date.getDate() ? 1 : -1));

	return new Response(JSON.stringify(projects), { status: 200 });
};

// Create a new project
// * INPUT: None
// * OUTPUT: String (url)
export const PUT: RequestHandler = async ({ locals }) => {
	const user = await userAuth(locals);

	if (!user) throw error(401, "Unauthorized");

	// Check for other projects and postfix this one
	const postfix = await prisma.project
		.findMany({
			where: {
				url: {
					startsWith: `untitled-${user.id}-`
				},
				ownerId: user.id
			}
		})
		.then((projects) => {
			let biggest = 0;

			// Generate a unique postifx for each new project based on how many there are
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
				url: `untitled-${user.id}-${postfix}`,
				title: `Untitled-${user.id}-${postfix}`,
				description: "A super cool untitled project!",
				theme: "3B84D6",
				date: new Date(),
				skills: ["Python", "Pytorch"],
				ownerId: user.id,
				content: { type: "doc", content: [{ type: "paragraph" }] },
				authors: {
					create: {
						userId: user.id,
						position: "Designer" // Designers the default since it's the first in the options list
					}
				}
			}
		})
		.catch(() => {
			throw error(400, "Bad Request");
		});

	return new Response(JSON.stringify({ url: project.url }), { status: 200 });
};

// Delete a project
// * INPUT: ProjectDeleteRequest
// * OUTPUT: None
export const DELETE: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	if (!user) throw error(401, "Unauthorized");

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
	if (project.ownerId !== user.id) throw error(401, "Unauthorized");

	// Delete the projects authors
	await prisma.projectAuthor.deleteMany({ where: { projectId: project.id } });

	// Delete the project
	await prisma.project
		.delete({
			where: { id: data.id }
		})
		.catch((e) => {
			console.log(e);
			throw error(500, "Internal Server Error");
		});

	return new Response(undefined, { status: 200 });
};
