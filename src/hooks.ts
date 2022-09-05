import type { GetSession, Handle } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import { parse, serialize } from "cookie";

// Intercept connections
export const handle: Handle = async ({ event, resolve }) => {
	// Get session token from cookies
	const session = parse(event.request.headers.get("cookie") || "").session;

	// Set locals to whatever is in the cookie, or null
	event.locals.session = session || null;

	// Resolve the request
	const res = await resolve(event);

	// Set the cookie to the locals, if the user just went through the auth process, the cookie will be set to the session token,
	// otherwise it will remain the same
	if (event.locals.session) {
		res.headers.set(
			"set-cookie",
			serialize("session", event.locals.session, {
				// Send cookie on every page
				path: "/",
				// Only allows server to write to cookie
				httpOnly: true,
				// CORS stricness, same origin only
				sameSite: "strict",
				// Only send over HTTPS when in production
				secure: process.env.NODE_ENV === "production",
				// Expire cookie after a week
				maxAge: 604800
			})
		);
	}

	return res;
};

// Every page gets access to the currently logged in users information
// If a page requests the session, it most likely needs currently active user info,
// so it fetches it here
export const getSession: GetSession = async (request) => {
	// If there isn't a session, return user as null
	if (!request.locals.session) return { user: null };

	// Find the user with the provided session token, if not found, return null
	const user = await prisma.user
		.findFirst({ where: { sessions: { has: request.locals.session } } })
		.then((user) => user)
		.catch(() => null);

	// If null unset the cookie
	if (!user) request.locals.session = null;

	return { user };
};
