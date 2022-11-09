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

// Insert an email into the hello@ai-camp.org account for contact form submissions
// * INPUT: MailRequest
// * OUTPUT: MailResponse
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: App.MailRequest = await request.json();

		// Create raw data for the email with the proper header information and a custom
		// HTML template
		const raw = Buffer.from(
			`Delivered-To: hello@ai-camp.org
			Return-Path: <${data.email}>
			From: <${data.email}>
			Reply-To: <${data.email}>
			To: <hello@ai-camp.org>
			Subject: CONTRACT - ${data.subject}
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
					<body style="font-family:Lato,sans-serif;padding:2.5rem 3rem;background-color:rgb(245,245,245);color:rgb(21,21,21);border-radius:1rem;font-size:20px;line-height:35px;">
						<div>
							<h1 class="font-semibold" style="margin-top: 0;font-size: inherit;">First Name</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${
								data.firstName
							}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">Last Name</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${
								data.lastName
							}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">Email</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${
								data.email
							}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">Phone Number</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid ${
								(data.phone != "" && "rgb(31,189,103)") ||
								"transparent"
							};">${data.phone}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">Company</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${
								data.company
							}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">What Talent Do You Need?</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${data.talent.join(
								", "
							)}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">Company Website</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${
								data.website
							}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">What Are We Doing?</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${
								data.doing
							}</div>
						</div><div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">How Did You Hear About Us?</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid ${
								(data.refer != "" && "rgb(31,189,103)") ||
								"transparent"
							};">${data.refer}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">Subject</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${
								data.subject
							}</div>
						</div>
						<div style="margin-top: 2rem;">
							<h1 class="font-semibold" style="font-size: inherit;">Message</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px 10px;border:2px solid rgb(31,189,103);">${
								data.message
							}</div>
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
