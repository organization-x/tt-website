import { error } from "@sveltejs/kit";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

import { colors } from "$lib/enums";
import { parse, prisma, userAuth } from "$lib/prisma";

import type { RequestHandler } from "./$types";
import type { SoftSkill, TechSkill } from "@prisma/client";

// Request handlers for managing user data in prisma, it uses the users session token to verify the API call

// TODO: Redis cache

// Create google analytics fetching client
const analytics = new BetaAnalyticsDataClient({
	credentials: {
		client_email: import.meta.env.VITE_ANALYTICS_EMAIL,
		// Replace \n characters with actual newlines because google is wack
		private_key: import.meta.env.VITE_ANALYTICS_KEY.replaceAll(
			/\\n/gm,
			"\n"
		)
	}
});

// Get analytics data for the specific user
// * INPUT: AnalyticsRequest
// * OUTPUT: AnalyticsResponse
export const POST: RequestHandler = async ({ locals, request }) => {
	const user = await userAuth(locals);

	if (!user) throw error(401, "Unauthorized");

	// Grab all projects this person is an author on to pull up relevant analytics
	const projects = await prisma.project.findMany({
		where: { ownerId: user.id },
		select: { id: true, title: true }
	});

	const projectIds = projects.map((project) => project.id);

	// Parse data or throw bad request if it isn't valid json
	const data: App.AnalyticsRequest = await parse(request);

	// Provide comparisons to the previous data within the same selected time period. For example if month
	// is selected provide a comparison to the previous month, if week is then compare to the previous week
	const end = new Date(data.endDate).getTime();
	let previous: string | { startDate: string; endDate: string } = new Date(
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
								inListFilter: {
									values: [
										"user_view",
										"user_projects_view",
										"user_kudos_view"
									]
								}
							}
						},
						{
							filter: {
								fieldName: "customEvent:id",
								stringFilter: {
									value: user.id
								}
							}
						}
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
						{
							filter: {
								fieldName: "customEvent:id",
								stringFilter: {
									value: user.id
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
	try {
		// Grab user views
		reports[0].rows!.forEach((row) => {
			// Previous daterange views
			if (row.dimensionValues![1].value === "date_range_1")
				return (response.prevViews = parseInt(
					row.metricValues![0].value!
				));

			const views = Number.parseInt(row.metricValues![0].value!);

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
				response.searches += Number.parseInt(
					row.metricValues![0].value!
				);
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
						value: Number.parseInt(row.metricValues![0].value!)
					} as App.GraphData);

					// Percent scrolled
					if (row.dimensionValues![0].value!.length)
						response.projects.scrolled.push({
							label,
							value: Number.parseInt(
								row.dimensionValues![0].value!
							)
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
					response.projects.searches += Number.parseInt(
						row.metricValues![0].value!
					);
				});
		}
	} catch {
		throw error(400, "Bad Request");
	}

	// Give every 10 project graph columns a different color, since the max on mobile is 5 columns a page and
	// 10 on desktop, we can use the same colors with an interval of 10
	response.projects.views.forEach((_, i) => {
		const color = colors[i % 10];

		response.projects.views[i].color = color;
		response.projects.scrolled[i].color = color;
	});

	return new Response(JSON.stringify(response), { status: 200 });
};
