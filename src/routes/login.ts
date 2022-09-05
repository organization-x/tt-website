import { Octokit } from "octokit";
import { prisma } from "$lib/prisma";
import { randomBytes } from "crypto";
import type { RequestHandler } from "@sveltejs/kit";
import type { User } from "@prisma/client";

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
			return {
				status: 302,
				headers: {
					location: "/auth"
				}
			};

		let session: string | null = null;

		const userCheck = async (): Promise<User> => {
			// Create secure session token
			session = randomBytes(16).toString("hex");

			// If the user exists, update their profile and push this session, otherwise create the user
			return await prisma.user
				.upsert({
					where: {
						id: user.login
					},
					create: {
						id: user.login,
						sessions: [session],
						iconurl: user.avatar_url,
						bannerurl: "/developers/user/banner.webp",
						name: user.name || user.login,
						about: user.bio || "I'm a TT member!",
						team: null,
						positions: [],
						skills: []
					},
					update: {
						sessions: {
							push: session
						}
					}
				})
				.then((user) => user)
				.catch(userCheck); // If an error occurs, like the session token somehow being the same, run the function again
		};

		const prismaUser = await userCheck();

		// Set locals to session token and redirect to the users profile
		// TODO: Change redirect to the users dashboard
		req.locals.session = session;
		return {
			status: 302,
			headers: {
				location: `/developers/${prismaUser.id}`
			}
		};
	} else {
		return {
			status: 302,
			headers: {
				location: `https://github.com/login/oauth/authorize?client_id=${id}&scope=read:user`
			}
		};
	}
};
