import { redirect } from "@sveltejs/kit";

import { prisma } from "$lib/prisma";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (request) => {
	// Date used for determining session expiry
	const date = new Date();
	date.setDate(date.getDate() - 7);

	// If a session local is present, check if it is valid, and if it is redirect to the dashboard
	if (
		await prisma.session.count({
			where: {
				token: request.locals.session || "",
				created: { gt: date }
			}
		})
	)
		throw redirect(302, "/dashboard");

	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	// Check if there is a code parameter in the request URl and that the state is valid, if not, go to the Discord OAuth page
	if (
		code &&
		request.cookies.get("state") === url.searchParams.get("state")
	) {
		// Get API token from OAuth code
		// TODO: Switch to actual redirect URI for production

		const token = (
			await fetch("https://discord.com/api/v10/oauth2/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: `client_id=${
					import.meta.env.VITE_DISCORD_ID
				}&client_secret=${
					import.meta.env.VITE_DISCORD_SECRET
				}&grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:5173/login`
			})
				.then((res) => res.json())
				.catch(() => {
					throw redirect(302, "/login");
				})
		).access_token as string;

		// Get the users info from Discor. If an error occurs fetching the user data, its
		// most likely an invalid token, so redirect back to the login
		const { id, username } = (await fetch(
			"https://discord.com/api/v10/users/@me",
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)
			.then((res) => res.json())
			.catch(() => {
				throw redirect(302, "/discord");
			})) as {
			id: string;
			username: string;
		};

		// Check if the user exists already
		let prismaUser = await prisma.user.findUnique({
			where: { id }
		});

		if (!prismaUser) {
			// If the user doesnt exist, create them
			prismaUser = await prisma.user.create({
				data: {
					id,
					url: username.toLowerCase().replaceAll(" ", "-"),
					name: username,
					about: "I'm a member of Team Tomorrow!",
					positions: ["Fullstack", "Designer"],
					techSkills: ["JavaScript", "Python"],
					softSkills: ["Teamwork", "Leadership"]
				}
			});

			// Create empty links object for the user
			await prisma.links.create({ data: { userId: id } });
		} else {
			// Otherwise, if they do exists, do some cleanup and check if they have any expired session
			// tokens inside postgres, if they do, remove them
			await prisma.session.deleteMany({
				where: { userId: id, created: { lte: date } }
			});
		}

		// Create a new session for the user, if the session token somehow already exists, recursively generate a new one
		const createSession = async (): Promise<string> => {
			return await prisma.session
				.create({
					data: { userId: id }
				})
				.then((session) => session.token)
				.catch(() => createSession());
		};

		const session = await createSession();

		// Set session cookie and remove state cookie
		request.cookies.set("session", session, { maxAge: 604800 });
		request.cookies.set("state", "", { maxAge: 0 });

		// Redirect to the main dashboard page
		throw redirect(302, "/dashboard");
	} else {
		// Generate state value
		const state = Math.random().toString(36).substring(2, 17);

		// Set state cookie that expires in 5 minutes
		request.cookies.set("state", state, {
			maxAge: 300,
			path: "/login"
		});

		// Redirect to oauth screen with state
		// TODO: Switch to actual redirect URI for production
		//TODO: &redirect_uri=https%3A%2F%2Fteamtomorrow.us%2Flogin
		throw redirect(
			302,
			`https://discord.com/api/oauth2/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flogin&response_type=code&scope=identify&&client_id=${
				import.meta.env.VITE_DISCORD_ID
			}&state=${state}`
		);
	}
};
