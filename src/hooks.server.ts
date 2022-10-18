import { parse } from "cookie";

import type { Handle } from "@sveltejs/kit";

// Intercept connections
export const handle: Handle = ({ event, resolve }) => {
	// Get session token from cookies
	const session = parse(event.request.headers.get("cookie") || "").session;

	// Set locals to whatever is in the cookie, or null
	event.locals.session = session || null;

	// Resolve the request
	return resolve(event);
};
