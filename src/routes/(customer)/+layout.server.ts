import isbot from "isbot";

import { userAuth } from "$lib/prisma";

import type { LayoutServerLoad } from "./$types";

// Initilize analytics across all customer-facing routes
export const load: LayoutServerLoad<{
	track: boolean;
	user: App.UserWithMetadata | null;
}> = async ({ locals, request }) => {
	// If a user is logged in grab their data for a dashboard shortcut and for endorsements
	const user = (await userAuth(locals)) || null;

	// If a user is logged in or if they're identified as a bot, don't track them
	// if (locals.session || isbot(request.headers.get("user-agent")))
	// 	return { track: false, user };

	return { track: true, user };
};
