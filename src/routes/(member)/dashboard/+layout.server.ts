import { userAuth } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";
import type { Links, User } from "@prisma/client";

// TODO: Update loaded data when the user changes
// If a user tries to access the dashboard without being logged in, redirect them to the login page
export const load: LayoutServerLoad<{
	links: Links;
	user: User;
}> = async ({ locals, cookies }) => {
	const props = await userAuth(locals);

	if (!props) {
		locals.session = null;
		cookies.delete("session");
		throw redirect(302, "/login");
	}

	return props;
};
