import { parse, serialize } from "cookie";

import type { Handle } from "@sveltejs/kit";

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
