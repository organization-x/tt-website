import { error } from "@sveltejs/kit";

import { prisma, checkSession, getUsers, parse } from "$lib/prisma";

import type { RequestHandler } from "./$types";

// TODO: possibly implement rate limiting on all API routes

// Request handlers for managing user data in prisma, it uses the users session token to verify the API call

// Update user information
// * INPUT: UserUpdateRequest
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const session = await checkSession(locals);

	// If the session token is invalid, throw unauthorized
	if (!session) throw error(401, "Unauthorized");

	// Parse data or throw bad request if it isn't valid json
	const data: App.UserUpdateRequest = await parse(request);

	// If the token isn't the same as for the user they are updating, throw unauthorized
	if (data.where.id !== session.userId) throw error(401, "Unauthorized");

	// Input validation
	if (
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

	// Update the user
	await prisma.user
		.update({
			where: data.where,
			data: {
				about: data.user.about,
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
		})
		.catch(() => {
			throw error(400, "Bad Request");
		});

	return new Response(undefined, { status: 200 });
};

// Search for users, otherwise a +page.server.ts should be used
// * INPUT: UserSearchRequest
// * OUTPUT: User[]
export const POST: RequestHandler = async ({ request }) => {
	const data: App.UserSearchRequest = await parse(request);

	// Grab users using request, if an error occurs throw a bad request
	const users = await getUsers(data.where)
		.then((users) => users)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	return new Response(JSON.stringify(users), { status: 200 });
};
