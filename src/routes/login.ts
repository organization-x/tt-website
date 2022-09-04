import { prisma } from "$lib/prisma";
import { Octokit } from "octokit";
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
			return {
				status: 302,
				headers: {
					location: "/auth"
				}
			};

		// Check if the user exists in the database
		const existingUser = await prisma.user.findUnique({
			where: { id: user.login }
		});

		// If user exists log them in, its verified that its them since usernames are unique
		// TODO: Change redirect to the users dashboard
		if (existingUser) {
			req.locals.user = existingUser;
			return {
				status: 302,
				headers: {
					location: `/developers/${existingUser.id}`
				}
			};
		}

		// Create new user in postgres with github information as autofill
		const newUser = await prisma.user.create({
			data: {
				id: user.login,
				iconurl: user.avatar_url,
				bannerurl: "/developers/user/banner.webp",
				name: user.name || user.login,
				about: user.bio || "I'm a TT member!",
				team: null,
				positions: [],
				skills: []
			}
		});

		// Set locals to user id and redirect to their profile
		// TODO: Change redirect to the users dashboard
		req.locals.user = newUser;
		return {
			status: 302,
			headers: {
				location: `/developers/${newUser.id}`
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
