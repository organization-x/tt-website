import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

// Make sure the user accesing this an admin
export const load: LayoutServerLoad = async ({ parent }) => {
	const user = await parent();

	if (user.role !== "Admin") throw redirect(302, "/dashboard");
};
