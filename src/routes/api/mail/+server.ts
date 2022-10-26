import { error } from "@sveltejs/kit";
import { gmail } from "@googleapis/gmail";
import { OAuth2Client } from "googleapis-common";

import { env } from "$env/dynamic/private";

import type { RequestHandler } from "./$types";

// Request handler for managing form submission from the contact form and inserting them into Gmail

const auth = new OAuth2Client({
	clientId: env.GOOGLE_ID,
	clientSecret: env.GOOGLE_SECRET,
	redirectUri: "localhost:3000"
});

auth.setCredentials({
	refresh_token: env.GOOGLE_REFRESH
});

const mail = gmail({ version: "v1", auth: auth });

// Search for users, otherwise a +page.server.ts should be used
// * INPUT: MailRequest
// * OUTPUT: MailResponse
export const GET: RequestHandler = async ({ request }) => {
	try {
		// const data: App.MailRequest = await request.json();

		// Temp for testing
		const data = {
			message: "Hello World",
			name: "John Doe",
			company: "Google",
			email: "jd@gwagle.com",
			subject: "Test"
		};

		// Create raw data for the email with the proper header information and a custom
		// HTML template
		const raw = Buffer.from(
			`Delivered-To: hello@ai-camp.org
			Return-Path: <${data.email}>
			From: <${data.email}>
			Reply-To: <${data.email}>
			To: <hello@ai-camp.org>
			Subject: ${data.subject}
			MIME-Version: 1.0
			Content-Type: text/html; charset=us-ascii
			<!DOCTYPE html>
				<html>
					<head>
						<meta charset="UTF-8">

						<link
							rel="stylesheet"
							href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
						/>
					</head>
					<body style="font-family: Lato, sans-serif; padding: 2rem 5rem; background-color: black; color: white; border-radius: 1rem">
						<h1>Hello</h1>
						<div style="background-color: rgba(47, 46, 46, 0.4); border-radius: 0.5rem; padding: 3rem">
						</div>
					</body>
				</html>
			`.replaceAll(/^	+/gm, "")
		).toString("base64");

		// Insert an email into the hello@ai-camp.org email with the form data received along with a header
		// that says the email is from the provided email to provide a seamless email thread process
		mail.users.messages.insert({
			userId: "me",
			requestBody: {
				labelIds: ["INBOX", "IMPORTANT", "UNREAD"],
				raw
			}
		});
	} catch {
		throw error(400, "Bad Request");
	}

	return new Response(undefined, { status: 200 });
};
