import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

import type { Prisma } from "@prisma/client";

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

	const sesh = await prisma.session.findUnique({
		where: { token: session },
		include: {
			user: {
				include: {
					links: {
						select: {
							userId: false,
							Devto: true,
							Facebook: true,
							GitHub: true,
							LinkedIn: true,
							Twitter: true,
							Website: true
						}
					},
					pinnedProject: true
				}
			}
		}
	});

	// Check if the session token is valid
	if (!sesh) {
		return false;
	}

	return { ...sesh.user } as App.UserWithMetadata;
};

// Grab multiple users based on a prisma where statement, used for search
export const getUsers = (where: Prisma.UserWhereInput) =>
	prisma.user.findMany({
		where,
		include: {
			links: {
				select: {
					userId: false,
					Devto: true,
					Facebook: true,
					GitHub: true,
					LinkedIn: true,
					Twitter: true,
					Website: true
				}
			},
			pinnedProject: true
		}
	});

// Grab multiple projects based on a prisma where statement, used for search
export const getProjects = (where: Prisma.ProjectWhereInput) =>
	prisma.project
		.findMany({
			where,
			include: {
				authors: { select: { user: true, position: true } }
			}
		})
		.then((projects) => projects);

// Used for parsing request data on API endpoints
export const parse = (request: Request) =>
	request
		.json()
		.then((data) => data)
		.catch(() => {
			throw error(400, "Bad Request");
		});
