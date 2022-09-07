import { redirect } from "@sveltejs/kit";

import type { PageLoad } from "@sveltejs/kit";

// If a user tries to access the dashboard without being logged in, redirect them to the login page
export const load: PageLoad = async ({ session }) => {
	if (session.user) return;

	throw redirect(302, "/login");
};
