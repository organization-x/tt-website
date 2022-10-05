import { user as store } from "$lib/stores";
import { userAuth } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";
import { user as store } from "$lib/stores";

import type { LayoutServerLoad } from "./$types";

// If a user tries to access the dashboard without being logged in, redirect them to the login page
export const load: LayoutServerLoad<App.UserWithMetadata> = async ({
	locals,
	cookies
}) => {
	const user = await userAuth(locals);

	if (!user) {
		locals.session = null;
		cookies.delete("session");
		throw redirect(302, "/login");
	}

	// Use a store so if the user gets updated the dashboard doesnt need to fetch data
	store.set(user);

	return user;
};

// Just some context of the stores, the user store is never updated directly by toggles because
// firstly the debounce boud would fire whenever the user object updates, not just that specific toggleable
// property which makes it neccesary to have a seperate variavle and secondly, because we dont to update
// the stores value with the wrong information if the debounce doesnt complete and that toggle is in reality
// in the opposite state
