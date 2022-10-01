import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Check if session token even exists and if it does check if it's valid.
// This is used for verification on API calls
export const checkSession = async ({ session }: App.Locals) => {
	if (!session) return false;
	const sesh = await prisma.session.findUnique({ where: { token: session } });
	return sesh ? sesh : false;
};

// Check if session token even exists and if it does grab the user from it.
// This is used for loading user data with a +page.server.ts file
export const userAuth = async ({ session }: App.Locals) => {
	if (!session) return false;
	const sesh = prisma.session.findUnique({ where: { token: session } });

	const user = sesh.user();

	// Check if the session token is valid
	if (!(await sesh)) {
		return false;
	}

	return {
		links: (await user.links())!,
		user: (await user)!
	};
};
