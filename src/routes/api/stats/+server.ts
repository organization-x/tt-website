import Redis from "ioredis";
import { error } from "@sveltejs/kit";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

import { colors } from "$lib/enums";
import { createHash } from "node:crypto";
import { env } from "$env/dynamic/private";
import { prisma, userAuth } from "$lib/prisma";

import type { RequestHandler } from "./$types";
import type { SoftSkill, TechSkill } from "@prisma/client";

// Request handlers for managing user data in prisma, it uses the users session token to verify the API call

const redis = new Redis(env.REDIS_URL);

// Create google analytics fetching client
const analytics = new BetaAnalyticsDataClient({
	credentials: {
		client_email: env.GOOGLE_EMAIL,
		// Replace \n characters with actual newlines because google is wack
		private_key: env.GOOGLE_KEY.replaceAll(/\\n/gm, "\n")
	}
});

// Get analytics data for the specific user
// * INPUT: startDate=string, endDate=string, mode=string, ids?=string[]
// * OUTPUT: AnalyticsResponse | UsersAnalyticsResponse
export const GET: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	if (!user) throw error(401, "Unauthorized");

	try {
		const query = new URL(request.url).searchParams;

		const isPersonal = query.get("mode") === "Personal";

		// If the query includes a mode other than personal and the user isn't an admin, throw bad request
		if (!isPersonal && user.role !== "Admin")
			throw error(400, "Bad Request");

		// If the user is an admin, check if id's are provided to grab other users data. Otherwise
		// proceed as normal
		let ids = query.get("ids")?.split(",");

		if (user.role === "Admin" && ids) {
			const data: App.UsersAnalyticsResponse = {};
			const requests: Parameters<typeof analytics.runReport>[0][] = [];

			// Check if any of the ids have already been cached and grab their cached data instead
			await Promise.all(
				ids.map(async (id) => {
					// Get the cached data from redis, the hash is different from the normal analytics since we keep them
					// seperate. The reason for this is because this request only gets view data while the others get much
					// more for per-user analytics and we can't keep partial data under the same hash
					const cached = await redis.get(
						createHash("shake128", { outputLength: 10 })
							.update("users" + id)
							.digest("hex")
					);

					// If cache was found then remove them from the IDs and add their data, otherwise
					// add a request in for them
					if (cached) {
						const analytics = JSON.parse(cached);

						data[id] = {
							new: analytics.new,
							returning: analytics.returning
						};

						ids = ids!.filter((i) => i !== id);
					} else
						requests.push({
							dateRanges: [
								{ startDate: "30daysAgo", endDate: "today" }
							],
							metrics: [
								{
									name: "eventCount"
								}
							],
							dimensions: [
								{
									name: "newVsReturning"
								},
								{
									name: "customEvent:id"
								}
							],
							dimensionFilter: {
								andGroup: {
									expressions: [
										{
											filter: {
												fieldName: "eventName",
												stringFilter: {
													value: "user_view"
												}
											}
										},
										{
											filter: {
												fieldName: "customEvent:id",
												stringFilter: {
													value: id
												}
											}
										}
									]
								}
							}
						});
				})
			);

			// Grab all the remaining waiting to be fetched data
			if (requests.length) {
				let reports = [];

				for (let i = 0; i < requests.length; i += 5) {
					reports.push(
						(
							await analytics
								.batchRunReports({
									property: "properties/336430086",
									requests: requests.slice(i, i + 5)
								})
								.catch(() => {
									throw error(400, "Bad Request");
								})
						)[0].reports!
					);
				}

				// Flatten all reports into one array
				reports = reports.flat();

				await Promise.all(
					reports.map(async (report) => {
						// If there's no data don't fill any out for this user
						if (!report.rows?.length) return;

						const analytics = {
							new: 0,
							returning: 0
						};

						report.rows!.forEach((row) => {
							const views = parseInt(row.metricValues![0].value!);

							// If this row is for returning users, add the views, otherwise add it to new users
							row.dimensionValues![0].value! === "returning"
								? (analytics.returning += views)
								: (analytics.new += views);
						});

						// Add it to the return data
						data[report.rows![0].dimensionValues![1].value!] =
							analytics;

						const hash = createHash("shake128", {
							outputLength: 10
						})
							.update(
								"users" +
									report.rows![0].dimensionValues![1].value!
							)
							.digest("hex");

						// Cache the data
						await redis.set(hash, JSON.stringify(analytics));

						// Create a 6 hour caching period
						await redis.expire(hash, 60 * 60 * 6);
					})
				);
			}

			// Add zeros for all the remaining users that returned no data
			await Promise.all(
				ids.map(async (id) => {
					if (data[id]) return;

					data[id] = { new: 0, returning: 0 };

					const hash = createHash("shake128", {
						outputLength: 10
					})
						.update("users" + id)
						.digest("hex");

					// Cache the data
					await redis.set(
						hash,
						JSON.stringify({ new: 0, returning: 0 })
					);

					// Create a 6 hour caching period
					await redis.expire(hash, 60 * 60 * 6);
				})
			);

			return new Response(JSON.stringify(data), { status: 200 });
		}

		const data = {
			startDate: query.get("startDate")!,
			endDate: query.get("endDate")!
		};

		// Create a unique hash of this request, if it's an admin add a boolean to the has to differentiate
		// global data to their personal data
		const hash = createHash("shake128", { outputLength: 10 })
			.update(
				data.startDate + data.endDate + user.id + String(isPersonal)
			)
			.digest("hex");

		// Check if this request has been cached
		const cached = await redis.get(hash);

		if (cached) return new Response(cached, { status: 200 });

		// Grab all projects this person is an author on to pull up relevant analytics, or if
		// the user is an admin grab all projects
		const projects = await prisma.project.findMany({
			...(isPersonal ? { where: { ownerId: user.id } } : {}),
			select: { id: true, title: true }
		});

		const projectIds = projects.map((project) => project.id);

		// Provide comparisons to the previous data within the same selected time period. For example if month
		// is selected provide a comparison to the previous month, if week is then compare to the previous week
		const end = new Date(data.endDate).getTime();
		let previous: string | { startDate: string; endDate: string } =
			new Date(
				end - (new Date(data.startDate).getTime() - end)
			).toLocaleDateString("en-CA");
		previous = { startDate: previous, endDate: previous };

		// The request sent to the Google Analytics API
		const requests = [
			// Grab the users views across all their pages and new vs returning users for the date range selected
			// and the previous based on that date range
			{
				dateRanges: [data, previous],
				metrics: [
					{
						name: "eventCount"
					}
				],
				dimensions: [
					{
						name: "newVsReturning"
					}
				],
				dimensionFilter: {
					andGroup: {
						expressions: [
							{
								filter: {
									fieldName: "eventName",
									stringFilter: {
										value: "user_view"
									}
								}
							},
							...(isPersonal
								? [
										{
											filter: {
												fieldName: "customEvent:id",
												stringFilter: {
													value: user.id
												}
											}
										}
								  ]
								: [])
						]
					}
				}
			},
			// Grab the users top soft skills filters in search
			{
				dateRanges: [data, previous],
				metrics: [
					{
						name: "eventCount"
					}
				],
				dimensions: [
					{
						name: "customEvent:soft_skills"
					},
					{
						name: "customEvent:tech_skills"
					}
				],
				dimensionFilter: {
					andGroup: {
						expressions: [
							{
								filter: {
									fieldName: "eventName",
									stringFilter: {
										value: "user_click"
									}
								}
							},
							...(isPersonal
								? [
										{
											filter: {
												fieldName: "customEvent:id",
												stringFilter: {
													value: user.id
												}
											}
										}
								  ]
								: [])
						]
					}
				},
				orderBys: [
					{
						desc: true,
						metric: {
							metricName: "eventCount"
						}
					}
				],
				limit: 2
			}
		] as Parameters<typeof analytics.runReport>[0][];

		if (projectIds.length)
			requests.push(
				// Grab the users project views along with the percent scrolled on each project
				{
					dateRanges: [data],
					metrics: [
						{
							name: "eventCount"
						}
					],
					dimensions: [
						{
							name: "percentScrolled"
						},
						{
							name: "customEvent:id"
						}
					],
					dimensionFilter: {
						andGroup: {
							expressions: [
								{
									filter: {
										fieldName: "eventName",
										stringFilter: {
											value: "project_view"
										}
									}
								},
								{
									filter: {
										fieldName: "customEvent:id",
										inListFilter: {
											values: projectIds
										}
									}
								}
							]
						}
					},
					orderBys: [
						{
							desc: true,
							metric: {
								metricName: "eventCount"
							}
						}
					]
				},
				// Grab the users project clicks in search results along with the tech skills
				{
					dateRanges: [data, previous],
					metrics: [
						{
							name: "eventCount"
						}
					],
					dimensions: [
						{
							name: "customEvent:tech_skills"
						}
					],
					dimensionFilter: {
						andGroup: {
							expressions: [
								{
									filter: {
										fieldName: "eventName",
										stringFilter: {
											value: "project_click"
										}
									}
								},
								{
									filter: {
										fieldName: "customEvent:id",
										inListFilter: {
											values: projectIds
										}
									}
								}
							]
						}
					},
					orderBys: [
						{
							desc: true,
							metric: {
								metricName: "eventCount"
							}
						}
					],
					limit: 2
				}
			);

		const reports = (
			await analytics
				.batchRunReports({
					property: "properties/336430086",
					requests
				})
				.catch(() => {
					throw error(400, "Bad Request");
				})
		)[0].reports!;

		const response = {
			returning: 0,
			new: 0,
			prevViews: 0,
			searches: 0,
			prevSearches: 0,
			softSkills: [],
			techSkills: [],
			projects: {
				searches: 0,
				prevSearches: 0,
				views: [],
				scrolled: [],
				techSkills: []
			}
		} as App.AnalyticsResponse;

		// Reports index key
		// 0: User views
		// 1: User search clicks with soft skills and tech skills
		// 2: User project views with percent scrolled
		// 3: User project clicks in search results with tech skills

		// Restructure data from analytics API so it's easier to use
		// Grab user views
		reports[0].rows!.forEach((row) => {
			// Previous daterange views
			if (row.dimensionValues![1].value === "date_range_1")
				return (response.prevViews = parseInt(
					row.metricValues![0].value!
				));

			const views = parseInt(row.metricValues![0].value!);

			// If this row is for returning users, add the views, otherwise add it to new users
			row.dimensionValues![0].value! === "returning"
				? (response.returning += views)
				: (response.new += views);
		});

		// Grab top soft skills and tech skills associated with user clicks in searches along with the number of searches
		// the data is based on
		if (reports[1].rowCount)
			reports[1].rows!.forEach((row, i) => {
				// Previous daterange searches
				if (row.dimensionValues![2].value === "date_range_1")
					return (response.prevSearches += parseInt(
						row.metricValues![0].value!
					));

				// If the soft skill doesn't exist dont't add it or the views associated with it
				if (!row.dimensionValues![0].value!.length) return;

				// The rows are always in order of soft skills first, then tech skills
				if (i)
					response.techSkills.push(
						row.dimensionValues![0].value! as TechSkill
					);
				else
					response.softSkills.push(
						row.dimensionValues![0].value! as SoftSkill
					);

				// Add search clicks to total
				response.searches += parseInt(row.metricValues![0].value!);
			});

		if (projectIds.length) {
			// Grab the users project views and percent scrolled on each one
			if (reports[2].rowCount)
				reports[2].rows!.forEach((row) => {
					// If the project id somehow doesn't exist, ignore
					if (!row.dimensionValues![1].value!) return;

					// Get the project title as a label for graph data
					const label = projects.find(
						(project) =>
							project.id === row.dimensionValues![1].value!
					)!.title;

					// If either the percent scrolled or views isn't availible, don't include one or the other. Just
					// include none or both
					if (
						!row.metricValues![0].value!.length ||
						!row.dimensionValues![0].value!.length
					)
						return;

					// Project views
					response.projects.views.push({
						label,
						value: parseInt(row.metricValues![0].value!)
					} as App.GraphData);

					// Percent scrolled
					if (row.dimensionValues![0].value!.length)
						response.projects.scrolled.push({
							label,
							value: parseInt(row.dimensionValues![0].value!)
						} as App.GraphData);
				});

			// Grab top tech skills associated with project clicks in searches and the number of searches
			// the data is based on
			if (reports[3].rowCount)
				reports[3].rows!.forEach((row) => {
					// Previous daterange searches
					if (row.dimensionValues![1].value === "date_range_1")
						return (response.projects.prevSearches = parseInt(
							row.metricValues![0].value!
						));

					// If the tech skill doesn't exist dont't add it or the views associated with it
					if (!row.dimensionValues![0].value!.length) return;

					// Tech skills
					response.projects.techSkills.push(
						row.dimensionValues![0].value! as TechSkill
					);

					// Add search clicks to total
					response.projects.searches += parseInt(
						row.metricValues![0].value!
					);
				});
		}

		// Give every 10 project graph columns a different color, since the max on mobile is 5 columns a page and
		// 10 on desktop, we can use the same colors with an interval of 10
		response.projects.views.forEach((_, i) => {
			const color = colors[i % 10];

			response.projects.views[i].color = color;
			response.projects.scrolled[i].color = color;
		});

		const json = JSON.stringify(response);

		// Add the response to the cache so that we don't reach the Google Analytics API limit.
		// The key is the date selected along with the users ID all hashed to improve performance, we
		// don't want to be using that entire string as the key
		await redis.set(hash, json);

		// Create a 6 hour caching period
		await redis.expire(hash, 60 * 60 * 6);

		return new Response(json, { status: 200 });
	} catch {
		throw error(400, "Bad Request");
	}
};
