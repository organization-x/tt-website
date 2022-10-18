import { redirect } from "@sveltejs/kit";
import { userAuth, prisma } from "$lib/prisma";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (request) => {
	const user = await userAuth(request.locals);

	// If the user isn't logged in, send them to the landing page
	if (!user) throw redirect(302, "/");

	// If the user already has a Discord ID attached, send them to their dashboard
	if (user.discordId) throw redirect(302, "/dashboard");

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
				}&grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:5173/discord`
			})
				.then((res) => res.json())
				.catch(() => {
					throw redirect(302, "/discord");
				})
		).access_token as string;

		// Get the users ID from discord
		const discordId = (
			await fetch("https://discord.com/api/v10/users/@me", {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
				.then((res) => res.json())
				.catch((e) => {
					console.log(e);
					throw redirect(302, "/discord");
				})
		).id as string;

		// Update the user
		await prisma.user.update({
			where: { id: user.id },
			data: { discordId }
		});

		// The only place discord OAuth is used is the kudos dashboard, so redirect there
		throw redirect(302, "/dashboard/kudos");
	} else {
		// Generate state value
		const state = Math.random().toString(36).substring(2, 17);

		// Set state cookie that expires in 5 minutes
		request.cookies.set("state", state, {
			maxAge: 300,
			path: "/discord"
		});

		// Redirect to oauth screen with state
		// TODO: Switch to actual redirect URI for production
		throw redirect(
			302,
			`https://discord.com/api/oauth2/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fdiscord&response_type=code&scope=identify&client_id=${
				import.meta.env.VITE_DISCORD_ID
			}&state=${state}`
		);
	}
};
