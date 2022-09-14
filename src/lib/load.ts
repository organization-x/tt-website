// ! TEMPORARY FILE
// ! This file is for grabbing user data on the dashboard, there is a current bug in
// ! SvelteKit where +layout.server.ts has some weird SSR issues, so I'm just going to
// ! shove this in here for now.

import { prisma } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

// This looks bad its just importing typing from where it's supposed to be
import type { Links, User } from "@prisma/client";
import type { PageServerLoad } from ".svelte-kit/types/src/routes/dashboard/$types";

// If a user tries to access the dashboard without being logged in, redirect them to the login page.
// If they are logged in, grab the users main data, links, and project authors
export const load: PageServerLoad<{
	links: Links;
	user: User;
}> = async ({ locals, cookies }) => {
	// If no session is present, redirect to login
	if (!locals.session) throw redirect(302, "/login");

	const session = prisma.session.findUnique({
		where: { token: locals.session }
	});

	const user = session.user();

	// If there isn't a session, the token is old or invalid, redirect to login and remove the
	// current session cookie and set the local to null
	if (!(await session)) {
		locals.session = null;
		cookies.delete("session");
		throw redirect(302, "/login");
	}

	return {
		links: (await user.links())!,
		user: (await user)!
	};
};
