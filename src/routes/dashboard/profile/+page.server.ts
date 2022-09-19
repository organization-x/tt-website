import { grabUser } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import type { Links, User } from "@prisma/client";

// If a user tries to access the dashboard without being logged in, redirect them to the login page.
// If they are logged in, grab the users main data, links, and project authors
export const load: PageServerLoad<{
	links: Links;
	user: User;
}> = async ({ locals, cookies }) => {
	const props = await grabUser(locals);

	if (!props) {
		locals.session = null;
		cookies.delete("session");
		throw redirect(302, "/login");
	}

	return props;
};
