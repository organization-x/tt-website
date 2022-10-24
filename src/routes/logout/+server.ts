import { redirect } from "@sveltejs/kit";

import { prisma } from "$lib/prisma.js";

import type { RequestHandler } from "@sveltejs/kit";

// On logout remove any cookies by setting the session cookie to expire immediatley and
// removing the session from postgres, then redirect to home page
export const GET: RequestHandler = async (request) => {
	if (request.locals.session)
		await prisma.session.delete({
			where: { token: request.locals.session }
		});

	request.cookies.set("session", "", { maxAge: 0 });

	throw redirect(302, "/");
};
