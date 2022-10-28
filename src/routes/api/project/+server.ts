import { error } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import { prisma, userAuth, getProjects } from "$lib/prisma";

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

	try {
		const data: App.ProjectUpdateRequest = await request.json();

		// Grab the project from the database for validation
		const project = await prisma.project.findUnique({
			where: data.where,
			include: { pinnedBy: true, authors: { select: { userId: true } } }
		});

		if (!project) throw error(400, "Bad Request");

		// If the user id doesn't match with the owner or a collaborator, throw unauthorized.
		// The owner and collaborators do not share the same editing permissions, the collaborators
		// only should be able to update the projects content, not its metadata
		if (project.ownerId === user.id) {
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
							(author) => author.user.id === project.ownerId
						)))
			)
				throw error(400, "Bad Request");
		} else if (
			project.authors.some((author) => author.userId === user.id)
		) {
			// Input validation, check if the collaborator is submitting any data besides content
			if (
				Object.keys(data.project).some(
					(key) => key !== "content" && key !== "date"
				)
			)
				throw error(400, "Bad Request");
		} else throw error(401, "Unauthorized");

		let url: string | undefined;

		// If the title is being changed, do some more input validation
		if (data.project.title) {
			// Create a url out of the title if it exists
			url = data.project.title.trim().replaceAll(" ", "-").toLowerCase();

			// Check if project has the same url (so title) as another project
			if (
				await prisma.project.count({
					where: { url, id: { not: project.id } }
				})
			)
				return new Response(JSON.stringify({ error: "SAME_TITLE" }), {
					status: 200
				});
		} else url = project.url;

		// Update the project
		await prisma.project.update({
			where: data.where,
			data: {
				url,
				title: data.project.title,
				description: data.project.description,
				theme: data.project.theme,
				date: new Date(),
				skills: data.project.skills,
				content: data.project.content,
				visible: data.project.visible,
				authors: data.project.authors
					? {
							deleteMany: {},
							createMany: {
								data: data.project.authors.map(
									({ user, position }) => ({
										userId: user.id,
										position
									})
								)
							}
					  }
					: undefined
			}
		});

		return new Response(JSON.stringify({ url }), { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};

// Search for projects, otherwise a +page.server.ts should be used
// * INPUT: where=Prisma.ProjectWhereInput
// * OUTPUT: ProjectWithAuthors[]
export const GET: RequestHandler = async ({ request }) => {
	try {
		const projects = await getProjects(
			JSON.parse(
				new URL(request.url).searchParams.get("where")!
			) as Prisma.ProjectWhereInput
		);

		// Sort projects by most recently updated
		projects.sort((p, n) => (p.date.getDate() < n.date.getDate() ? 1 : -1));

		return new Response(JSON.stringify(projects), { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};

// Create a new project
// * INPUT: None
// * OUTPUT: String (url)
export const POST: RequestHandler = async ({ locals }) => {
	const user = await userAuth(locals);

	if (!user) throw error(401, "Unauthorized");

	try {
		// Remove any spaces from the name for url encoding
		const name = user.name.replaceAll(" ", "-");

		// Check for other projects and postfix this one
		const postfix = await prisma.project
			.findMany({
				where: {
					url: {
						startsWith: `untitled-${name}-`
					}
				}
			})
			.then((projects) => {
				let biggest = 0;

				// Generate a unique postifx for each new project based on how many there are
				projects.forEach((project) => {
					try {
						const url = project.url.split("-");
						const int = parseInt(url[url.length - 1]);
						int > biggest && (biggest = int);
					} catch {
						return;
					}
				});

				return biggest + 1;
			});

		// Create the project
		const project = await prisma.project.create({
			data: {
				url: `untitled-${name}-${postfix}`,
				title: `Untitled-${name}-${postfix}`,
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
		});

		const body = new FormData();

		// TODO: Replace URL for production
		// The users and proejects share the same ID structure since they will never clash
		body.set("id", "banner-" + project.id);
		body.set("url", "https://tt-alpha.fly.dev/assets/default/banner.webp");

		// Add default banner
		await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
				},
				body
			}
		);

		return new Response(JSON.stringify({ url: project.url }), {
			status: 200
		});
	} catch {
		throw error(400, "Bad Request");
	}
};

// Delete a project
// * INPUT: ProjectDeleteRequest
// * OUTPUT: None
export const DELETE: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	if (!user) throw error(401, "Unauthorized");

	try {
		const data: App.ProjectDeleteRequest = await request.json();

		// Check if the project exists
		const project = await prisma.project.findUnique({
			where: { id: data.id }
		});

		if (!project) throw error(400, "Bad Request");

		// Check if the user owns the project
		if (project.ownerId !== user.id) throw error(401, "Unauthorized");

		// Delete the projects authors
		await prisma.projectAuthor.deleteMany({
			where: { projectId: project.id }
		});

		// Delete the project
		await prisma.project.delete({
			where: { id: data.id }
		});

		// Delete the banner
		await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1/banner-${project.id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
				}
			}
		);

		return new Response(undefined, { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};
