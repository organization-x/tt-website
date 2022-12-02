import type { Handle } from "@sveltejs/kit";

// Intercept connections
export const handle: Handle = ({ event, resolve }) => {
	// Set locals to whatever is in the cookie, or null
	event.locals.session = event.cookies.get("session") || null;

	// Resolve the request
	return resolve(event);
};
