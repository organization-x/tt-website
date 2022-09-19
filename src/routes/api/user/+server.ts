import { error } from "@sveltejs/kit";
import { prisma, checkSession } from "$lib/prisma";

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
	const data: App.UserUpdateRequest = await request
		.json()
		.then((data) => data)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	// If the token isn't the same as for the user they are updating, throw unauthorized
	if (data.where.id !== session.userId) throw error(401, "Unauthorized");

	// Input validation
	if (
		!(
			data.user.positions.length >= 2 ||
			data.user.softSkills.length >= 2 ||
			data.user.techSkills.length >= 2
		)
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
				techSkills: data.user.techSkills
			}
		})
		.catch(() => {
			throw error(400, "Bad Request");
		});

	// Omit userId from links update, we don't want people to update the userId
	const { userId, ...links } = data.links;

	// Update the links or create them, if provided
	if (data.links) {
		await prisma.links
			.update({
				where: { userId: data.where.id },
				data: links
			})
			.catch(() => {
				throw error(400, "Bad Request");
			});
	}

	return new Response(undefined, { status: 200 });
};

// Search for users, otherwise a +page.server.ts should be used
// * INPUT: UserSearchRequest
// * OUTPUT: User[]
export const POST: RequestHandler = async ({ request }) => {
	const data: App.UserSearchRequest = await request.json();

	// Grab users using request, if an error occurs throw a bad request
	const users = await prisma.user
		.findMany({ where: data.where })
		.then((users) => users)
		.catch(() => {
			throw error(400, "Bad Request");
		});

	return new Response(JSON.stringify(users), { status: 200 });
};
