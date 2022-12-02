import { prisma } from "$lib/prisma.js";

import type { RequestHandler } from "@sveltejs/kit";

// On logout remove any cookies by setting the session cookie to expire immediatley and
// removing the session from postgres, then redirect to home page
export const GET: RequestHandler = async (request) => {
	const users = await prisma.user.findMany({
		select: { url: true, lastUpdated: true }
	});

	const projects = await prisma.project.findMany({
		select: { url: true, date: true }
	});

	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			<url>
				<loc>https://www.teamtomorrow.com</loc>
				<changefreq>weekly</changefreq>
				<priority>1</priority>
			</url>
			<url>
				<loc>https://www.teamtomorrow.com/about</loc>
				<changefreq>monthly</changefreq>
				<priority>0.6</priority>
			</url>
			<url>
				<loc>https://www.teamtomorrow.com/contact</loc>
				<changefreq>monthly</changefreq>
				<priority>0.5</priority>
			</url>
			<url>
				<loc>https://www.teamtomorrow.com/developers</loc>
				<changefreq>daily</changefreq>
				<priority>0.8</priority>
			</url>
			<url>
				<loc>https://www.teamtomorrow.com/projects</loc>
				<changefreq>daily</changefreq>
				<priority>0.8</priority>
			</url>
			${users
				.map(
					({ url, lastUpdated }) => `
			<url>
				<loc>https://www.teamtomorrow.com/developers/${url}</loc>
				<changefreq>daily</changefreq>
				<lastmod>${lastUpdated.toISOString().split("T")[0]}</lastmod>
				<priority>0.5</priority>
			</url>`
				)
				.join("")}
			${projects
				.map(
					({ url, date }) => `
			<url>
				<loc>https://www.teamtomorrow.com/projects/${url}</loc>
				<changefreq>daily</changefreq>
				<lastmod>${date.toISOString().split("T")[0]}</lastmod>
				<priority>0.5</priority>
			</url>`
				)
				.join("")}
		</urlset>`.trim(),
		{
			status: 200,
			headers: { "Content-Type": "application/xml" }
		}
	);
};
