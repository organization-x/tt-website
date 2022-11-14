import { prisma } from "$lib/prisma";

import type { User } from "@prisma/client";
import type { PageServerLoad } from "./$types";

// Grab the current users on the homepage for editing
export const load: PageServerLoad<{
	homeUsers: User[];
}> = async () => ({
	homeUsers: await prisma.user.findMany({
		where: {
			homepage: true
		}
	})
});
