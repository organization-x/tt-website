import { error, type HttpError } from "@sveltejs/kit";
import { parse } from "node-html-parser";

import { env } from "$env/dynamic/private";
import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
import { prisma, userAuth, getProjects } from "$lib/prisma";

import type { Prisma } from "@prisma/client";
import type { RequestHandler } from "./$types";
import type { JSONContent } from "@tiptap/core";

// Request handlers for managing project data in prisma, it uses the users session token to verify the API call

// Update project information
// * INPUT: FormData: project, images
// * OUTPUT: ProjectUpdateResponse
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = (await userAuth(locals, true))!;

	try {
		const data = (await request.json()) as App.ProjectUpdateRequest;

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
						!data.authors.some(
							(author) => author.user.id === project.ownerId
						)))
			)
				throw error(400, "Bad Request");
		} else if (
			// Check if this user is a collaborator
			project.authors.some((author) => author.userId === user.id)
		) {
			// Make sure collaborators can't update the visibility or authors
			if (
				Object.keys(data).some(
					(key) => key === "visibility" || key === "authors"
				)
			)
				throw error(401, "Unauthorized");
		} else throw error(401, "Unauthorized");

		let url: string;

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

		// Keep track of the image ids so when this project is deleted or the images are deleted they
		// do not stay on Cloudflare images
		let ids: string[] | undefined;

		// Keep track of images with their hash and correspoding Cloudflare images ID so the connectd clients
		// stay updated
		const images: Record<string, string> = {};

		// If there's content, sync the images with cloudflare images and also send back to ID's of the images to the
		// clients editing so they can have updated data
		if (data.content) {
			// Find all images in the content and use the image data provided to upload them, if there is an image in the content that
			// isn't in the image data, throw a bad request. Also, all provided ids will be checked to make sure they still exist on
			// Cloudflare images, if they don't they will be re-uploaded
			await Promise.all(
				(data.content as JSONContent).content!.map(async (node) => {
					if (
						node.type !== "image" ||
						!node.attrs!.src.startsWith("blob:")
					)
						return;

					const hash = data.images[node.attrs!.src] as string;

					if (!hash) throw error(400, "Bad Request");

					const image = data.images[hash] as App.Image;

					if (!image) throw error(400, "Bad Request");

					// If the file size of the image is over 2MB, throw a bad request
					if (image.data.length > 2000000)
						throw error(400, "Bad Request");

					// If provided, check if the image ID exists, if so, use that already existing cloudflare URL
					if (
						image.id &&
						(await fetch(
							`${PUBLIC_CLOUDFLARE_URL}/${image.id}/banner`,
							{
								method: "HEAD"
							}
						).then((res) => res.ok))
					)
						return (
							(node.attrs!.src = `${PUBLIC_CLOUDFLARE_URL}/${image.id}/banner`) &&
							(images[hash] = image.id)
						);

					// Otherwise, if it doesn't exist or doesn't have an ID, upload it to cloudflare
					// Then upload the new image to Cloudflare

					const body = new FormData();

					body.set("file", new Blob([new Uint8Array(image.data)]));

					const id = `${project.id}-${Date.now()}`;

					// Set the ID to include the project ID
					body.set("id", id);

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

					node.attrs!.src = `${PUBLIC_CLOUDFLARE_URL}/${id}/banner`;
					images[hash] = id;
				})
			);

			// Delete images that no longer exist in the content. This
			// doesn't need to be awaited since nothing depends on it
			ids = Object.values(images);
			project.images.map(
				(image) =>
					!ids!.includes(image) &&
					fetch(
						`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1/${image}`,
						{
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
							}
						}
					)
			);
		}

		// Update the project
		await prisma.project.update({
			where: { id: project.id },
			data: {
				url,
				title: data.title?.trim(),
				description: data.description,
				date: new Date(),
				skills: data.skills,
				content: data.content,
				images: ids,
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

		return new Response(
			JSON.stringify({ images, url } as App.ProjectUpdateResponse),
			{ status: 200 }
		);
	} catch (err) {
		// Catch errors and propogate the proper error codes
		if (
			(err as HttpError)?.status === 401 ||
			(err as HttpError)?.status === 400
		)
			throw err;

		throw error(400, "Bad Request");
	}
};

// Search for projects
// * INPUT: where=Prisma.ProjectWhereInput
// * OUTPUT: ProjectWithAuthors[]
export const GET: RequestHandler = async ({ request }) => {
	try {
		return new Response(
			JSON.stringify(
				await getProjects(
					JSON.parse(
						new URL(request.url).searchParams.get("where")!
					) as Prisma.ProjectWhereInput
				)
			),
			{ status: 200 }
		);
	} catch {
		throw error(400, "Bad Request");
	}
};

// Create a new project
// * INPUT: None
// * OUTPUT: ProjectCreateResponse
export const POST: RequestHandler = async ({ locals }) => {
	const user = (await userAuth(locals, true))!;

	try {
		// Remove any spaces from the name for url encoding
		const name = user.name.replaceAll(/\s+/g, "-");

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

						if (int > biggest) biggest = int;
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

		return new Response(
			JSON.stringify({ url: project.url } as App.ProjectCreateResponse),
			{
				status: 200
			}
		);
	} catch {
		throw error(400, "Bad Request");
	}
};

// Delete a project
// * INPUT: ProjectDeleteRequest
// * OUTPUT: None
export const DELETE: RequestHandler = async ({ locals, request }) => {
	const user = (await userAuth(locals, true))!;

	try {
		const data: App.ProjectDeleteRequest = await request.json();

		// Check if the project exists and this user owns the project
		const project = await prisma.project.findFirst({
			where: { id: data.id, ownerId: user.id }
		});

		if (!project) throw error(400, "Bad Request");

		// Before the project gets deleted, make sure it isn't pinned
		if (user.pinnedProjectId === project.id)
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

		// Delete the banner. This isn't awaited since nothing relies on it
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
// * OUTPUT: FormData: title, icon
export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, "Unauthorized");

	const session = await prisma.session.count({
		where: { token: locals.session }
	});

	if (!session) throw error(401, "Unauthorized");

	try {
		// Use formdata since it's more efficient than JSON for file data
		const data = new FormData();

		// Fetch the URL given
		const response = await fetch(
			new URL(request.url).searchParams.get("url")!
		).catch(() => null);

		// If the URL is invalid, give placeholder info
		if (!response) {
			data.append("title", "Unknown");

			return new Response(data, { status: 200 });
		}

		// Parse the HTML for information extraction
		const page = parse(await response.text());

		// Find all icon meta tags and then sort them by their resolution, the highest resolution
		// icon is what we want
		let icon: string | Blob | undefined = page
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

		// If there's no icon, attempt to grab it using the website URL. Otherwise if the icon
		// is using a relative URL we can construct it while using the same http protocol as the website
		if (!icon) icon = `https://${urlSplit[2]}/favicon.ico`;
		else
			icon = icon.startsWith("http")
				? icon
				: `${urlSplit[0]}//${urlSplit[2]}${
						icon.startsWith("/") ? icon : "/" + icon
				  }`;

		// Try to convert the icon to a blob to avoid CORS errors
		try {
			icon = await fetch(icon).then((res) => res.blob());
		} catch {
			icon = undefined;
		}

		// Append the title
		data.append(
			"title",
			page.getElementsByTagName("title")[0]?.innerHTML || "Unknown"
		);

		// Append the icon if it exists
		if (icon) data.append("icon", icon);

		return new Response(data, { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};
