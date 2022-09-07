import { Octokit } from "octokit";
import { prisma } from "$lib/prisma";
import type { RequestHandler } from "@sveltejs/kit";

const id = import.meta.env.VITE_CLIENT_ID;

export const GET: RequestHandler = async (req) => {
	const code = new URL(req.url).searchParams.get("code");

	// Check if there is a code parameter in the request URl, if not, go to github oauth page
	if (code) {
		// Fetch access token from github API
		const token = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({
					client_id: id,
					client_secret: import.meta.env.VITE_CLIENT_SECRET,
					code
				})
			}
		)
			.then((res) => res.json())
			.then((res) => res.access_token);

		// Using octokit, make a github API request for the user data
		const user = await new Octokit({ auth: token })
			.request("GET /user")
			.then((res) => res.data)
			.catch(() => null);

		// If an error occurs fetching the user data, its most likely an expired token, so redirect to github oauth page
		if (!user)
			return new Response(undefined, {
				status: 302,
				headers: {
					location: "/auth"
				}
			});

		// Check if the user exists already
		let prismaUser = await prisma.user.findUnique({
			where: { id: user.login }
		});

		if (!prismaUser) {
			// If the user doesnt exist, create them
			prismaUser = await prisma.user.create({
				data: {
					id: user.login,
					url: user.login,
					name: user.name || user.login,
					about: user.bio || "I'm a TT member!",
					team: null,
					positions: [],
					skills: []
				}
			});
		} else {
			// Otherwise, if they do exists, do some cleanup and check if they have any expired session
			// tokens inside postgres, if they do, remove them
			await prisma.session
				.findMany({ where: { userId: user.login } })
				.then((sessions) => {
					sessions.forEach(async (session) => {
						// Add a week to the session expiry date
						session.created.setDate(session.created.getDate() + 7);

						// Check if its been a week since the token has been created
						if (session.created <= new Date()) {
							await prisma.session.delete({
								where: { token: session.token }
							});
						}
					});
				})
				.catch(); // If there are no sessions, ignore it
		}

		// Create a new session for the user, if the session token somehow already exists, recursively generate a new one
		const createSession = async (): Promise<string> => {
			return await prisma.session
				.create({ data: { userId: user.login } })
				.then((session) => session.token)
				.catch(() => createSession());
		};

		const session = await createSession();

		// Set locals to session token and redirect to the users profile
		// TODO: Change redirect to the users dashboard
		req.locals.session = session;
		return new Response(undefined, {
			status: 302,
			headers: {
				location: `/developers/${prismaUser.id}`
			}
		});
	} else {
		return new Response(undefined, {
			status: 302,
			headers: {
				location: `https://github.com/login/oauth/authorize?client_id=${id}&scope=read:user`
			}
		});
	}
};
