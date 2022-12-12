import { error } from "@sveltejs/kit";

import { prisma, userAuth } from "$lib/prisma";

import type { Prisma } from "@prisma/client";
import type { RequestHandler } from "./$types";

// Request handlers for managing user data in prisma, it uses the users session token to verify the API call

// Update user information
// * INPUT: UserUpdateRequest
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = (await userAuth(locals, true))!;

	const data: App.UserUpdateRequest = await request.json().catch(() => {
		throw error(400, "Bad Request");
	});

	// If the token isn't the same as for the user they are updating and they aren't an admin, throw unauthorized
	if (data.id !== user.id && user.role !== "Admin")
		throw error(401, "Unauthorized");

	try {
		// Input validation
		if (
			(data.role !== user.role &&
				(user.role !== "Admin" || data.role === "Admin")) ||
			(data.name &&
				(data.name.length > 25 ||
					data.name.length < 1 ||
					/[^a-zA-Z\s-]/g.test(data.name))) ||
			(data.positions &&
				(data.positions.length < 2 || data.positions.length > 4)) ||
			(data.softSkills &&
				(data.softSkills.length < 2 || data.softSkills.length > 5)) ||
			(data.techSkills &&
				(data.techSkills.length < 2 || data.techSkills.length > 5)) ||
			(data.homepage &&
				(await prisma.user.count({ where: { homepage: true } })) === 3)
		)
			throw error(400, "Bad Request");

		const name = data.name?.trim();
		const url = name?.toLowerCase().replaceAll(/\s+/g, "-");

		// Check if the user has the same URL as another and throw an error if so
		if (
			url &&
			(await prisma.user.count({ where: { url, id: { not: data.id } } }))
		)
			return new Response(undefined, {
				status: 205
			});

		// Update the user
		await prisma.user.update({
			where: { id: data.id },
			data: {
				name,
				url,
				role: data.role,
				about: data.about?.trim(),
				team: data.team,
				positions: data.positions,
				softSkills: data.softSkills,
				techSkills: data.techSkills,
				pinnedProjectId: data.pinnedProjectId,
				visible: data.visible,
				homepage: data.homepage,
				links: {
					update: {
						GitHub: data.links?.GitHub,
						LinkedIn: data.links?.LinkedIn,
						Devto: data.links?.Devto,
						Twitter: data.links?.Twitter,
						Facebook: data.links?.Facebook,
						Website: data.links?.Website
					}
				}
			}
		});

		return new Response(undefined, { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};

// Search for users
// * INPUT: where=Prisma.UserWhereInput
// * OUTPUT: UserWithMetadata[]
export const GET: RequestHandler = async ({ request }) => {
	try {
		return new Response(
			JSON.stringify(
				await prisma.user.findMany({
					where: JSON.parse(
						new URL(request.url).searchParams.get("where")!
					) as Prisma.UserWhereInput,
					include: {
						links: {
							select: {
								userId: false,
								Devto: true,
								Facebook: true,
								GitHub: true,
								LinkedIn: true,
								Twitter: true,
								Website: true
							}
						},
						pinnedProject: true
					},
					orderBy: {
						lastUpdated: "desc"
					}
				})
			),
			{ status: 200 }
		);
	} catch {
		throw error(400, "Bad Request");
	}
};

// Add or remove endorsements on one of a user's skills
// * INPUT: EndorsementRequest
// * OUTPUT: EndorsementWithMetadata | undefined
export const POST: RequestHandler = async ({ locals, request }) => {
	const user = (await userAuth(locals, true))!;

	try {
		const data: App.EndorsementRequest = await request.json();

		// Don't let the user control their own endorsements
		if (data.id === user.id) throw error(400, "Bad Request");

		if (data.endorsing) {
			const type = data.softSkill ? "softSkill" : "techSkill";
			const skill = data.softSkill || data.techSkill;

			// Check if the user being endorsed has the skill listed, if not, throw a bad request
			if (
				!(await prisma.user.count({
					where: {
						id: data.id as string,
						[data.softSkill ? "softSkills" : "techSkills"]: {
							has: skill
						}
					}
				}))
			)
				throw error(400, "Bad Request");

			// Check if this endorsement has already been made, if so, throw a bad request
			if (
				await prisma.endorsement.count({
					where: {
						fromId: user.id,
						toId: data.id as string,
						[type]: skill
					}
				})
			)
				throw error(400, "Bad Request");

			const { id, from } = await prisma.endorsement.create({
				data: {
					fromId: user.id,
					toId: data.id as string,
					[type]: skill
				},
				include: {
					from: {
						select: {
							id: true,
							name: true,
							url: true
						}
					}
				}
			});

			return new Response(JSON.stringify({ id, from }), {
				status: 200
			});
		} else {
			await prisma.endorsement.delete({
				where: { id: data.id as number }
			});

			return new Response(undefined, { status: 200 });
		}
	} catch {
		throw error(400, "Bad Request");
	}
};
