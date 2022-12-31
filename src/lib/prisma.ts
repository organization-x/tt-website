import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

import type { Prisma } from "@prisma/client";

export const prisma = new PrismaClient();

// Check if session token even exists and if it does grab the user's data from it
export const userAuth = async ({ session }: App.Locals, throwError = false) => {
	if (!session) {
		if (throwError) throw error(401, "Unauthorized");

		return null;
	}

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
		if (throwError) throw error(401, "Unauthorized");

		return null;
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
			},
			orderBy: {
				date: "desc"
			}
		})
		.then((projects) => projects);

// Grab kudos data, the reason this is in here is since it falls under the same
// category of backend getters
export const getKudos = async (
	id: string,
	startDate: string,
	endDate: string,
	mode: "global" | "personal",
	page: number = 1
) => {
	// Grab the kudos data from the Discord bot API. This has a big type cast but this is the sole function
	// for fetching kudos data so there's no point in putting it in the global types
	const data = (
		mode === "personal"
			? await fetch(
					`https://ai-camp-data-layer.fly.dev/kudos/${id}?pageSize=100&startDate=${startDate}&endDate=${endDate}&page=${page}`
			  ).then((res) => res.json())
			: await fetch(
					`https://ai-camp-data-layer.fly.dev/kudos?pageSize=100&startDate=${startDate}&endDate=${endDate}&page=${page}`
			  ).then((res) => res.json())
	) as {
		kudos: {
			id: number;
			reason: string;
			receiver: {
				id: string;
				hippoId?: string;
			};
			receiverId: string;
			sender: {
				id: string;
				hippoId?: string;
			};
			senderId: string;
			timestamp: string;
		}[];
		page: number;
		pageSize: number;
		totalPages: number;
	};

	// If there's not kudos for this user return an empty array
	if (!data.kudos.length) return { pages: 0, page: 0, kudos: [] };

	// Get the name and id data for the kudos
	const users = await prisma.user.findMany({
		where: {
			id: {
				in: [
					...new Set(
						data.kudos.flatMap((kudo) => [
							kudo.senderId,
							kudo.receiverId
						])
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
	if (!users.length) return { pages: 0, page: 0, kudos: [] };

	// Refine the kudos data to be more usable
	return data.kudos.reduce(
		(result: { pages: number; page: number; kudos: App.Kudo[] }, kudo) => {
			// Grab the sending and receiving user from the collected data
			const [sender, receiver] = users.reduce(
				(result: { id: string; name: string }[], user) => {
					if (user.id === kudo.senderId) result[0] = user;
					if (user.id === kudo.receiverId) result[1] = user;

					return result;
				},
				[]
			);

			// If the either the sender or receiver don't have an account don't show the kudo
			if (!sender || !receiver) return result;

			// Provide either the receiving user if this user sent it or the
			// sending user if this user received it
			return {
				...result,
				kudos: [
					...result.kudos,
					{
						senderId: kudo.senderId,
						senderName: sender.name,
						receiverId: kudo.receiverId,
						receiverName: receiver!.name,
						reason: kudo.reason,
						timestamp: new Date(kudo.timestamp)
					} as App.Kudo
				]
			};
		},
		{ pages: data.totalPages, page, kudos: [] }
	);
};
