import { getKudos } from "$lib/prisma";

import type { PageServerLoad } from "./$types";

// Grab the kudos data for the current user
export const load: PageServerLoad<{ kudos: App.Kudo[] }> = async ({
	parent
}) => {
	const user = await parent();

	return { kudos: await getKudos(user.id) };
};
