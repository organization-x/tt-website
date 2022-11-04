import { error } from "@sveltejs/kit";

import { prisma, checkSession, userAuth } from "$lib/prisma";

import type { RequestHandler } from "./$types";
import type { Endorsement, Prisma } from "@prisma/client";

// Request handlers for managing user data in prisma, it uses the users session token to verify the API call

// Update user information
// * INPUT: UserUpdateRequest
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const session = await checkSession(locals);

	// If the session token is invalid, throw unauthorized
	if (!session) throw error(401, "Unauthorized");

	const data: App.UserUpdateRequest = await request.json().catch(() => {
		throw error(400, "Bad Request");
	});

	// If the token isn't the same as for the user they are updating, throw unauthorized
	if (data.id !== session.userId) throw error(401, "Unauthorized");

	try {
		// Input validation
		if (
			(data.name &&
				(data.name.length > 25 ||
					data.name.length < 1 ||
					/[^a-zA-Z\s]/g.test(data.name))) ||
			(data.positions &&
				(data.positions.length < 2 || data.positions.length > 4)) ||
			(data.softSkills &&
				(data.softSkills.length < 2 || data.softSkills.length > 5)) ||
			(data.techSkills &&
				(data.techSkills.length < 2 || data.techSkills.length > 5))
		)
			throw error(400, "Bad Request");

		const name = data.name?.trim();

		// Update the user
		await prisma.user.update({
			where: { id: data.id },
			data: {
				name,
				url: name?.toLowerCase().replaceAll(" ", "-"),
				about: data.about?.trim(),
				team: data.team,
				positions: data.positions,
				softSkills: data.softSkills,
				techSkills: data.techSkills,
				pinnedProjectId: data.pinnedProjectId,
				visible: data.visible,
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

// Search for users, otherwise a +page.server.ts should be used
// * INPUT: where=Prisma.UserWhereInput
// * OUTPUT:
export const GET: RequestHandler = async ({ request }) => {
	try {
		// Grab users using request
		const users = await prisma.user.findMany({
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
				pinnedProject: true,
				endorsementsReceived: {
					distinct: ["softSkill", "techSkill"]
				},
				_count: {
					select: {
						projects: true
					}
				}
			}
		});

		(
			users as (Omit<typeof users[0], "endorsementsReceived"> & {
				_count: { endorsements: number };
				endorsementsReceived?: Endorsement[];
			})[]
		).map((user) => {
			user._count.endorsements = user.endorsementsReceived!.length;

			delete user.endorsementsReceived;
		});

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
