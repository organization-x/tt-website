import { serialize } from "cookie";
import { prisma } from "$lib/prisma.js";

import type { RequestHandler } from "@sveltejs/kit";

// On logout remove any cookies by setting the locals to null and setting the session cookie to expire immediatley,
// also remove the session from postgres, then redirect to home page
export const GET: RequestHandler = async (req) => {
	if (req.locals.session)
		await prisma.session.delete({ where: { token: req.locals.session } });

	req.locals.session = null;

	return new Response(undefined, {
		status: 302,
		headers: {
			location: "/",
			"set-cookie": serialize("session", "", { expires: new Date(0) })
		}
	});
};
