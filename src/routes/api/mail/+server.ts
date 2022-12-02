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

// Get the proper origin URL for API verification based on the node enviornment
const origin = import.meta.env.PROD
	? "https://teamtomorrow.com"
	: "http://localhost:5173";

// Insert an email into the hello@ai-camp.org account for contact form submissions
// * INPUT: MailRequest
// * OUTPUT: MailResponse
export const POST: RequestHandler = async ({ request }) => {
	// Block requests which are not using cors and the origin isn't the website, this could
	// be bypassed but blocks easy spamming of the API
	if (request.mode !== "cors" || request.headers.get("origin") !== origin)
		throw error(403, "Forbidden");

	try {
		const data: App.MailRequest = await request.json();

		// Trim all string fields and determine whether optional fields are present
		Object.keys(data).forEach((key) => {
			if (!data[key] || typeof data[key] !== "string") return;

			const trimmed = (data[key] as string).trim();

			trimmed.length ? (data[key] = trimmed) : (data[key] = undefined);
		});

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

					<body style="font-family:Lato,sans-serif;padding:2.5rem 3rem;background-color:rgb(245,245,245);color:rgb(21,21,21);border-radius:1rem;font-size:20px;line-height:35px;margin-top:30px;">
						<div>
							<h1 style="margin-top: 0;font-size: inherit;">First Name</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
								${data.firstName}
							</div>
						</div>

						<div style="margin-top: 2rem;">
							<h1 style="font-size: inherit;">Last Name</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
								${data.lastName}
							</div>
						</div>

						<div style="margin-top: 2rem;">
							<h1 style="font-size: inherit;">Email</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
								${data.email}
							</div>
						</div>

						${
							data.phone
								? `<div style="margin-top: 2rem;">
									<h1 style="font-size: inherit;">Phone Number</h1>
									<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
										${data.phone}
									</div>
								</div>`
								: ""
						}

						<div style="margin-top: 2rem;">
							<h1 style="font-size: inherit;">Company</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
								${data.company}
							</div>
						</div>

						<div style="margin-top: 2rem;">
							<h1 style="font-size: inherit;">What Talent Do You Need?</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
								${data.talent.join(", ")}
							</div>
						</div>

						${
							data.website
								? `<div style="margin-top: 2rem;">
									<h1 style="font-size: inherit;">Company Website</h1>
									<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
										${data.website}
									</div>
								</div>`
								: ""
						}

						<div style="margin-top: 2rem;">
							<h1 style="font-size: inherit;">What Are We Doing?</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
								${data.doing}
							</div>
						</div>

						${
							data.refer
								? `<div style="margin-top: 2rem;">
									<h1 style="font-size: inherit;">How Did You Hear About Us?</h1>
									<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
										${data.refer}
									</div>
								</div>`
								: ""
						}

						<div style="margin-top: 2rem;">
							<h1 style="font-size: inherit;">Subject</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
								${data.subject}
							</div>
						</div>

						<div style="margin-top: 2rem;">
							<h1 style="font-size: inherit;">Message</h1>
							<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;">
								${data.message}
							</div>
						</div>

						${
							data.developers.length
								? `<div style="margin-top: 2rem;">
										<h1 style="font-size: inherit;">Selected Developers</h1>
										<div style="width:calc(100% - 24px);min-height:35px;background-color:rgb(235,235,235);border-radius:10px;color:rgb(21,21,21);padding:20px;padding-bottom:0;">
											${data.developers
												.map(
													({ id, name }) => `
											<div
												style="display:flex;overflow:hidden;padding-bottom:1rem;"
											>
												<img
													style="border-radius:999px;width:3rem;height:3rem;object-fit:cover;object-position:center;"
													height="512"
													width="512"
													src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-${id}/avatar"
													alt="${name}'s avatar"
													loading="lazy"
												/>

												<p
													style="overflow:auto;margin:auto 0.75rem;height:min-content;"
												>
													${name.split(" ")[0]}
												</p>
											</div>`
												)
												.join("")}
										</div>
									</div>`
								: ""
						}
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
