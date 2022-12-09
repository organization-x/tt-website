import { error } from "@sveltejs/kit";
import { parse } from "node-html-parser";

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
			where: { id: data.id },
			include: { pinnedBy: true, authors: { select: { userId: true } } }
		});

		if (!project) throw error(400, "Bad Request");

		// If the user id doesn't match with the owner or a collaborator, throw unauthorized.
		// The owner and collaborators do not share the same editing permissions, the collaborators
		// only should be able to update the projects content, not its metadata
		if (project.ownerId === user.id || user.role === "Admin") {
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
						(user.role !== "Admin" &&
							!data.authors.some(
								(author) => author.user.id === project.ownerId
							))))
			)
				throw error(400, "Bad Request");
		} else if (
			project.authors.some((author) => author.userId === user.id)
		) {
			// Check if this user is an author and is submitting any author or visibility data
			if (
				Object.keys(data).some(
					(key) => key === "authors" || key === "visible"
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
			// doesn't need to be awaited since it doesn't interact with the postgres database
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
				.replaceAll(/\s+/g, "-")
				.toLowerCase();

			// Check if project has the same url as another project and send a unique response code if it does
			if (
				await prisma.project.count({
					where: { url, id: { not: project.id } }
				})
			)
				return new Response(undefined, {
					status: 205
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

		return new Response(undefined, { status: 200 });
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

		// The users and proejects share the same ID structure since they will never clash
		body.set("id", "banner-" + project.id);
		body.set("url", "https://teamtomorrow.com/assets/default/banner.webp");

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

		// Before he project gets deleted, make sure it isn't pinned
		await prisma.user.update({
			where: { id: user.id },
			data: { pinnedProjectId: null }
		});

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

// Grab URL information when adding a link mark for the editor, for example if you linked
// Google it would grab the title and description of google.com and display it when active, this is
// done via an API to bypass CORS errors
// * INPUT: url=string
// * OUTPUT: UrlMetadataResponse
export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, "Unauthorized");

	const session = await prisma.session.count({
		where: { token: locals.session }
	});

	if (!session) throw error(401, "Unauthorized");

	try {
		// Fetch the URL given
		const response = await fetch(
			new URL(request.url).searchParams.get("url")!
		).catch(() => null);

		// If the URL is invalid, give placeholder info
		if (!response)
			return new Response(
				JSON.stringify({
					title: "Unknown"
				} as App.UrlMetadataResponse),
				{ status: 200 }
			);

		// Parse the HTML for information extraction
		const page = parse(await response.text());

		// Find all icon meta tags and then sort them by their resolution, the highest resolution
		// icon is what we want
		let icon = page
			.getElementsByTagName("link")
			.filter((link) => link.getAttribute("rel")?.includes("icon"))
			.sort((a, b) => {
				const sizesA = a.getAttribute("sizes");
				const sizesB = b.getAttribute("sizes");

				if (!sizesA) return 1;
				if (!sizesB) return -1;

				return (
					parseInt(sizesB.split("x")[0]) -
					parseInt(sizesA.split("x")[0])
				);
			})[0]
			?.getAttribute("href");

		const urlSplit = response.url.split("/");

		// If there's no icon, attempt to grab it using the website URL
		if (!icon) icon = `https://${urlSplit[2]}/favicon.ico`;

		// If the icon is using a relative URL we can construct it while using the same
		// protcol as the website
		icon = icon.startsWith("http")
			? icon
			: `${urlSplit[0]}//${urlSplit[2]}${
					icon.startsWith("/") ? icon : "/" + icon
			  }`;

		// If there's an icon, fetch the icon URL and convert it to a base64 string
		// to avoid CORS errors. Otherwise set it to undefined
		try {
			icon = await fetch(icon)
				.then((res) => res.arrayBuffer())
				.then(
					(data) =>
						`data:image/${icon!
							.split(".")
							.slice(-1)};base64,${Buffer.from(data).toString(
							"base64"
						)}`
				);
		} catch {
			icon = undefined;
		}

		return new Response(
			JSON.stringify({
				title:
					page.getElementsByTagName("title")[0]?.innerHTML ||
					"Unknown",
				icon
			} as App.UrlMetadataResponse),
			{ status: 200 }
		);
	} catch {
		throw error(400, "Bad Request");
	}
};
