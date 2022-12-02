import { PrismaClient } from "@prisma/client";

import type { Prisma } from "@prisma/client";

export const prisma = new PrismaClient();

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
					pinnedProject: true,
					endorsementsReceived: true
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

// Grab multiple projects based on a prisma where statement, used for search
export const getProjects = (where: Prisma.ProjectWhereInput) =>
	prisma.project
		.findMany({
			where,
			include: {
				authors: {
					select: {
						user: {
							select: {
								id: true,
								name: true,
								url: true
							}
						},
						position: true
					}
				}
			}
		})
		.then((projects) => projects);

// Grab kudos data, the reason this is in here is since it falls under the same
// category of backend getters
export const getKudos = async (id: string) => {
	// Grab the kudos data from the Discord bot API
	const data: App.KudosResponse = await fetch(
		`https://ai-camp-data-layer.fly.dev/ck/${id}?pageSize=9999`
	).then((res) => res.json());

	// If there's not kudos for this user return an empty array
	if (!data.ck.length) return [];

	// Get the name and id data for the kudos unless the sender is the
	// current user
	const users = await prisma.user.findMany({
		where: {
			id: {
				in: [
					...new Set(
						data.ck.reduce((result: string[], kudo) => {
							if (kudo.senderId !== id)
								result.push(kudo.senderId);

							if (kudo.receiverId !== id)
								result.push(kudo.receiverId);

							return result;
						}, [])
					)
				] as string[]
			}
		},
		select: {
			id: true,
			name: true
		}
	});

	// If all users don't have accounts return an empty array
	if (!users.length) return [];

	// Refine the kudos data to be more usable
	return data.ck.reduce((result: App.Kudo[], kudo) => {
		const isSender = kudo.senderId === id;

		// Grab the user from the collected data
		const userData = isSender
			? users.find((user) => user.id === kudo.receiverId)
			: users.find((user) => user.id === kudo.senderId);

		// If they don't exist don't show the kudo
		if (!userData) return result;

		// Provide either the receiving user if this user sent it or the
		// sending user if this user received it
		return [
			...result,
			{
				id: isSender ? kudo.receiverId : kudo.senderId,
				name: userData.name,
				reason: kudo.reason,
				type: (isSender ? "sent" : "received") as "sent" | "received",
				timestamp: kudo.timestamp
			}
		];
	}, []);
};
