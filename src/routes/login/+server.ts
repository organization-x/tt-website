import { redirect } from "@sveltejs/kit";

import { prisma } from "$lib/prisma";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";

import type { RequestHandler } from "./$types";

const redirectUri = dev
	? "http://localhost:5173/login"
	: "https://teamtomorrow.com/login";

const redirectUriEncoded = encodeURIComponent(redirectUri);

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

		const token = (
			await fetch("https://discord.com/api/v10/oauth2/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: `client_id=${env.DISCORD_ID}&client_secret=${env.DISCORD_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`
			})
				.then((res) => res.json())
				.catch(() => {
					throw redirect(302, "/login");
				})
		).access_token as string;

		// Get the users info from Discor. If an error occurs fetching the user data, its
		// most likely an invalid token, so redirect back to the login
		const { id, username, avatar } = (await fetch(
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
			avatar: string | null;
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
					url: username.trim().toLowerCase().replaceAll(" ", "-"),
					name: username,
					about: "I'm a member of Team Tomorrow!",
					positions: ["Fullstack", "Designer"],
					techSkills: ["JavaScript", "Python"],
					softSkills: ["Teamwork", "Leading"]
				}
			});

			// Create empty links object for the user
			await prisma.links.create({ data: { userId: id } });

			// Give them the default profile picture and banner on Cloudflare Images
			const body = new FormData();

			// Append the appropriate data, try to use the discord avatar if possible
			body.append("id", "avatar-" + id);
			body.append(
				"url",
				avatar
					? `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp`
					: "https://teamtomorrow.com/assets/default/avatar.webp"
			);

			// Add avatar
			await fetch(
				`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
					},
					body
				}
			);

			body.set("id", "banner-" + id);
			body.set(
				"url",
				"https://teamtomorrow.com/assets/default/banner.webp"
			);

			// Add banner
			await fetch(
				`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ID}/images/v1`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`
					},
					body
				}
			);
		} else {
			// Otherwise, if they do exists, do some cleanup and check if they have any expired session
			// tokens inside postgres, if they do, remove them
			await prisma.session.deleteMany({
				where: { userId: id, created: { lte: date } }
			});
		}

		// Create a new session for the user, if the session token somehow already exists, recursively generate a new one
		const createSession = (): Promise<string> =>
			prisma.session
				.create({
					data: { userId: id }
				})
				.then((session) => session.token)
				.catch(() => createSession());

		const session = await createSession();

		// Set session cookie and remove state cookie
		request.cookies.set("session", session, { maxAge: 604800, path: "/" });
		request.cookies.delete("state", { path: "/login" });

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
		throw redirect(
			302,
			`https://discord.com/api/oauth2/authorize?redirect_uri=${redirectUriEncoded}&response_type=code&scope=identify&client_id=${env.DISCORD_ID}&state=${state}`
		);
	}
};
