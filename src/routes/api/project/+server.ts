import { error } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import { prisma, userAuth, getProjects } from "$lib/prisma";

import type { Prisma } from "@prisma/client";
import type { RequestHandler } from "./$types";

// Request handlers for managing project data in prisma, it uses the users session token to verify the API call

// Update project information
// * INPUT: ProjectUpdateRequest
// * OUTPUT: ProjectUpdateResponse
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	// If the session token is invalid, throw unauthorized
	if (!user) throw error(401, "Unauthorized");

	try {
		const data: App.ProjectUpdateRequest = await request.json();

		// Grab the project from the database for validation
		const project = await prisma.project.findUnique({
			where: { id: data.id },
			include: { pinnedBy: true, authors: { select: { userId: true } } }
		});

		if (!project) throw error(400, "Bad Request");

		// If the user id doesn't match with the owner or a collaborator, throw unauthorized.
		// The owner and collaborators do not share the same editing permissions, the collaborators
		// only should be able to update the projects content, not its metadata
		if (project.ownerId === user.id) {
			// Input validation
			if (
				(data.title &&
					(data.title.length < 1 || data.title.length > 50)) ||
				(data.description &&
					(data.description.length < 1 ||
						data.description.length > 300)) ||
				(data.skills && data.skills.length < 2) ||
				(data.authors &&
					(data.authors.length < 1 ||
						!data.authors.some(
							(author) => author.user.id === project.ownerId
						)))
			)
				throw error(400, "Bad Request");
		} else if (
			project.authors.some((author) => author.userId === user.id)
		) {
			// Input validation, check if the collaborator is submitting any data besides the content, images, or ID
			if (
				Object.keys(data).some(
					(key) =>
						key !== "content" && key !== "images" && key !== "id"
				)
			)
				throw error(400, "Bad Request");
		} else throw error(401, "Unauthorized");

		// Basic check to make sure every image ID starts with the project ID
		if (
			data.images &&
			!data.images.every((image) => image.startsWith(project.id))
		) {
			throw error(400, "Bad Request");
		}

		// Update the image IDs inside of the project content
		if (data.images) {
			// Check if the newly submitted images exist on Cloudflare
			await Promise.all(
				data.images.map(
					async (image) =>
						!project.images.includes(image) &&
						(await fetch(
							`https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/${image}/banner`
						).catch(() => {
							throw error(400, "Bad Request");
						}))
				)
			);

			// Delete all images that are no longer included in the project. This
			// doesn't need to be awaited since it does interact with the postgres database
			project.images.map(
				(image) =>
					!data.images.includes(image) &&
					fetch(
						`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1/${image}`,
						{
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
							}
						}
					).catch(() => {}) // Ignore errors if one somehow occurs
			);
		}

		let url: string | undefined;

		// If the title is being changed, do some more input validation
		if (data.title) {
			// Create a url out of the title if it exists
			url = data.title
				.trim()
				.replaceAll(/[^a-zA-Z0-9\s]/g, "")
				.replaceAll(/\s/g, "-")
				.toLowerCase();

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
			where: { id: project.id },
			data: {
				url,
				title: data.title,
				description: data.description,
				theme: data.theme,
				date: new Date(),
				skills: data.skills,
				content: data.content,
				images: data.images,
				visible: data.visible,
				authors: data.authors
					? {
							deleteMany: {},
							createMany: {
								data: data.authors.map(
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
// * OUTPUT: ProjectCreateResponse
export const POST: RequestHandler = async ({ locals }) => {
	const user = await userAuth(locals);

	if (!user) throw error(401, "Unauthorized");

	try {
		// Remove any spaces from the name for url encoding
		const name = user.name.replaceAll(/\s/g, "-");

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

		// Check if the project exists and owns the project
		const project = await prisma.project.findFirst({
			where: { id: data.id, ownerId: user.id }
		});

		if (!project) throw error(400, "Bad Request");

		// Delete the projects authors
		await prisma.projectAuthor.deleteMany({
			where: { projectId: project.id }
		});

		// Delete the project
		await prisma.project.delete({
			where: { id: data.id }
		});

		// Delete the banner
		fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1/banner-${project.id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
				}
			}
		);

		// Delete the images inside the content
		project.images.forEach((id) => {
			fetch(
				`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1/${id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
					}
				}
			);
		});

		return new Response(undefined, { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};
