import { redirect } from "@sveltejs/kit";
import { createHash } from "node:crypto";
import { OAuth2Client } from "google-auth-library";

import { prisma } from "$lib/prisma";
import { analytics } from "$lib/analytics";

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

	// Create an OAuth client
	// TODO: Switch to actual redirect URI for production
	const oauth = new OAuth2Client(
		import.meta.env.VITE_GOOGLE_ID,
		import.meta.env.VITE_GOOGLE_SECRET,
		"http://localhost:5173/login"
	);

	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	// Check if there is a code parameter in the request URl and that the state is valid, if not, go to the Google OAuth page
	if (
		code &&
		request.cookies.get("state") === url.searchParams.get("state")
	) {
		// Set credentials based on oauth code
		oauth.setCredentials((await oauth.getToken(code)).tokens);

		// Get user data from google. If an error occurs fetching the user data, its
		// most likely an invalid token, so redirect back to the login
		const user = (await oauth
			.request({
				url: "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses"
			})
			.then((res) => res.data)
			.catch(() => {
				throw redirect(302, "/login");
			})) as {
			names: { displayName: string }[];
			emailAddresses: { value: string }[];
		};

		const name = user.names[0].displayName;

		// Make the user's ID a hashed version of their email so it doesn't get exposed on the frontend at any point
		const id = createHash("shake256", { outputLength: 15 })
			.update(user.emailAddresses[0].value)
			.digest("hex");

		// Check if the user exists already
		let prismaUser = await prisma.user.findUnique({
			where: { id: id }
		});

		if (!prismaUser) {
			// If the user doesnt exist, create them
			prismaUser = await prisma.user.create({
				data: {
					id,
					url: name.toLowerCase().replaceAll(" ", "-"),
					name,
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

		// Clear any analytics data that have been collected since they are not needed
		analytics.reset();

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
		throw redirect(
			302,
			`https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flogin&client_id=${
				import.meta.env.VITE_GOOGLE_ID
			}&state=${state}`
		);
	}
};
