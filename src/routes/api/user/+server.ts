import { prisma } from "$lib/prisma";
import { error } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

// Request handlers for managing user data in prisma, it uses the users session token to verify the API call

// Check if session toke even exists and if it does check if it's valud
const checkToken = async ({ session }: App.Locals) => {
	if (!session) return false;
	const sesh = await prisma.session.findUnique({ where: { token: session } });
	return sesh ? sesh : false;
};

// Update user information
// * INPUT: UserUpdateRequest
// * OUTPUT: None
export const PATCH: RequestHandler = async ({ locals, request }) => {
	const session = await checkToken(locals);

	// If the session token is invalid, throw unauthorized
	if (!session) throw error(401, "Unauthorized");

	const data: App.UserUpdateRequest = await request.json();

	console.log(data);

	// If the token isn't the same as for the user they are updating, throw unauthorized
	if (data.where.id !== session.userId) throw error(401, "Unauthorized");

	// Input validation
	if (
		!(
			data.user.positions.length > 2 ||
			data.user.softSkills.length > 2 ||
			data.user.techSkills.length > 2
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

	// TODO: Add project updation

	return new Response(undefined, { status: 200 });
};
