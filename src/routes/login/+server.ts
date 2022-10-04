import { Octokit } from "octokit";
import { prisma } from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

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

		// If an error occurs fetching the user data, its most likely an expired token (code parameter), so redirect to github oauth page
		if (!user) throw redirect(302, "/login");

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
					about: user.bio || "I'm a member of Team Tomorrow!",
					positions: ["Fullstack", "Designer"],
					techSkills: ["JavaScript", "Python"],
					softSkills: ["Teamwork", "Leadership"]
				}
			});

			// Create empty links object for the user
			await prisma.links.create({ data: { userId: user.login } });
		} else {
			const date = new Date();
			date.setDate(date.getDate() - 7);

			// Otherwise, if they do exists, do some cleanup and check if they have any expired session
			// tokens inside postgres, if they do, remove them
			await prisma.session.deleteMany({
				where: { userId: user.login, created: { lte: date } }
			});
		}

		// Create a new session for the user, if the session token somehow already exists, recursively generate a new one
		const createSession = async (): Promise<string> => {
			return await prisma.session
				.create({ data: { userId: user.login } })
				.then((session) => session.token)
				.catch(() => createSession());
		};

		const session = await createSession();

		// Set locals to session token and redirect to the main dashboard page
		req.locals.session = session;
		throw redirect(302, "/dashboard");
	} else {
		throw redirect(
			302,
			`https://github.com/login/oauth/authorize?client_id=${id}&scope=read:user`
		);
	}
};
