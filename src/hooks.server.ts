import type { Handle } from "@sveltejs/kit";

export const handle: Handle = ({ event, resolve }) => {
	// Set locals to whatever is in the session cookie, or null
	event.locals.session = event.cookies.get("session") || null;

	// Resolve the request
	return resolve(event);
};
