// This file contains functions related to generating SEO data or similar, all function names are based off of
// schema.org types

// Generate breadcrumb structured data
export const breadcrumb = (title: string, url: string) =>
	`<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Projects",
				item: "https://teamtomorrow.com/projects"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: title,
				item: `https://teamtomorrow.com/projects/${url}`
			}
		]
	})}</script>`;

// Generate Article structured data
export const article = (
	title: string,
	description: string,
	url: string,
	id: string,
	owner: string,
	modified: string,
	skills: string,
	body: string
) =>
	`<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Article",
		articleBody: body,
		headline: title,
		about: description,
		creator: owner,
		dateModified: {
			"@type": "Date",
			value: modified
		},
		keywords: skills,
		image: `https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-${id}/banner`,
		description: description,
		name: title,
		url: `https://teamtomorrow.com/projects/${url}`
	})}</script>`;

// Generate carousel structured data
export const carousel = (links: string[]) =>
	`<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: links.map((url, i) => ({
			"@type": "ListItem",
			position: i + 1,
			url: `https://teamtomorrow.com/projects/${url}`
		}))
	})}</script>`;
