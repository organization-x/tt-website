import { prisma } from "$lib/prisma.js";
import type { RequestHandler } from "@sveltejs/kit";
import { serialize } from "cookie";

// On logout remove any cookies by setting the locals to null and setting the session cookie to expire immediatley,
// also remove the session from postgres, then redirect to home page
export const GET: RequestHandler = async (req) => {
	await prisma.user
		.findFirst({ where: { sessions: { has: req.locals.session } } })
		.then(async (user) => {
			if (!user) return;
			await prisma.user.update({
				where: { id: user.id },
				data: {
					sessions: user.sessions.filter(
						(t) => t != req.locals.session
					)
				}
			});
		})
		.catch(); // If user doesnt exist ignore it

	req.locals.session = null;
	return {
		status: 302,
		headers: {
			location: "/",
			"set-cookie": serialize("session", "", { expires: new Date(0) })
		}
	};
};
