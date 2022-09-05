import { prisma } from "$lib/prisma.js";
import type { RequestHandler } from "@sveltejs/kit";
import { serialize } from "cookie";

// On logout remove any cookies by setting the locals to null and setting the session cookie to expire immediatley,
// also remove the session from postgres, then redirect to home page
export const GET: RequestHandler = async (req) => {
	if (req.locals.session) {
		await prisma.session
			.findUnique({ where: { token: req.locals.session } })
			.then(async (session) => {
				if (!session) return;

				await prisma.session.delete({
					where: { token: session.token }
				});
			});
	}

	req.locals.session = null;
	return {
		status: 302,
		headers: {
			location: "/",
			"set-cookie": serialize("session", "", { expires: new Date(0) })
		}
	};
};
