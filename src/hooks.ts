import type { GetSession, Handle } from "@sveltejs/kit";
import { parse, serialize } from "cookie";

// ! The worry here is that this could be insecure, but it isn't. Since the cookie is CORS enabled and the cookie is httpOnly,
// ! it can't be accessed by the client or set by it, and it cant be set by another server because of CORS. The way we verify the user
// ! is through their username at login, which is unique, so we know its them.

// Intercept connections
export const handle: Handle = async ({ event, resolve }) => {
	// Get user from cookies
	const user = parse(event.request.headers.get("cookie") || "").user;

	// Set locals to whatever is in the cookie, or null
	event.locals.user = user ? JSON.parse(user) : null;

	// Resolve the request
	const res = await resolve(event);

	// Set the cookie to the locals, if the user just went through the auth process, the cookie will be set to the user info,
	// otherwise it will remain the same
	if (event.locals.user) {
		res.headers.set(
			"set-cookie",
			serialize("user", JSON.stringify(event.locals.user), {
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
export const getSession: GetSession = async (request) => {
	return {
		user: request.locals.user
	};
};
