import { error } from "@sveltejs/kit";

import { prisma, checkSession, getUsers, userAuth } from "$lib/prisma";

import type { Prisma } from "@prisma/client";
import type { RequestHandler } from "./$types";

// Request handlers for managing user data in prisma, it uses the users session token to verify the API call

// Update user information
// * INPUT: UserUpdateRequest
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const session = await checkSession(locals);

	// If the session token is invalid, throw unauthorized
	if (!session) throw error(401, "Unauthorized");

	try {
		const data: App.UserUpdateRequest = await request.json();

		// If the token isn't the same as for the user they are updating, throw unauthorized
		if (data.where.id !== session.userId) throw error(401, "Unauthorized");

		// Input validation
		if (
			(data.user.name &&
				(data.user.name.length > 25 || data.user.name.length < 1)) ||
			(data.user.positions &&
				(data.user.positions.length < 2 ||
					data.user.positions.length > 4)) ||
			(data.user.softSkills &&
				(data.user.softSkills.length < 2 ||
					data.user.softSkills.length > 5)) ||
			(data.user.techSkills &&
				(data.user.techSkills.length < 2 ||
					data.user.techSkills.length > 5))
		)
			throw error(400, "Bad Request");

		const name = data.user.name?.trim();

		// Update the user
		await prisma.user.update({
			where: data.where,
			data: {
				name,
				url: name?.toLowerCase().replaceAll(" ", "-"),
				about: data.user.about?.trim(),
				team: data.user.team,
				positions: data.user.positions,
				softSkills: data.user.softSkills,
				techSkills: data.user.techSkills,
				pinnedProjectId: data.user.pinnedProjectId,
				visible: data.user.visible,
				links: {
					update: {
						GitHub: data.user.links?.GitHub,
						LinkedIn: data.user.links?.LinkedIn,
						Devto: data.user.links?.Devto,
						Twitter: data.user.links?.Twitter,
						Facebook: data.user.links?.Facebook,
						Website: data.user.links?.Website
					}
				}
			}
		});

		return new Response(undefined, { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};

// Search for users, otherwise a +page.server.ts should be used
// * INPUT: where=Prisma.UserWhereInput
// * OUTPUT: User[]
export const GET: RequestHandler = async ({ request }) => {
	try {
		// Grab users using request, if an error occurs throw a bad request
		const users = await getUsers(
			JSON.parse(
				new URL(request.url).searchParams.get("where")!
			) as Prisma.UserWhereInput
		);

		return new Response(JSON.stringify(users), { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};

// Add/remove endorsements on one of a user's skills
// * INPUT: EndorsementRequest
// * OUTPUT: EndorsementWithMetadata | undefined
export const POST: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	// Only allow Leads and Admins to endorse
	if (!user || user.role === "User") throw error(401, "Unauthorized");

	try {
		const data: App.EndorsementRequest = await request.json();

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

			const endorsement = await prisma.endorsement.create({
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

			return new Response(
				JSON.stringify({
					id: endorsement.id,
					from: {
						id: endorsement.from.id,
						url: endorsement.from.url,
						name: endorsement.from.name
					}
				}),
				{
					status: 200
				}
			);
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

// TODO: Fix animation for endorsements
// TODO: Cleanup overall design/code (rushed)
