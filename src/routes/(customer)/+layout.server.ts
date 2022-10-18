import isbot from "isbot";

import type { LayoutServerLoad } from "./$types";

// Initilize analytics across all customer-facing routes
export const load: LayoutServerLoad<{ track: boolean }> = async ({
	locals,
	request
}) => {
	// If a user is logged in or if they're identified as a bot, don't track them
	if (locals.session || isbot(request.headers.get("user-agent")))
		return { track: false };

	return { track: true };
};
