<script lang="ts">
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

	import { techSkills } from "$lib/enums";
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";
	import Wrench from "$lib/components/icons/general/Wrench.svelte";
	import ProjectLoading from "$lib/components/ProjectLoading.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";
	import ProjectFilter from "$lib/components/projects/ProjectFilter.svelte";

	import type { PageData } from "./$types";
	import type { AnalyticsInstance } from "analytics";
	import type { Prisma, TechSkill } from "@prisma/client";

	export let data: PageData;

	let page = 0;
	let search = "";
	let filters: TechSkill[] = [];
	let analytics: AnalyticsInstance | undefined;
	let request: Promise<App.ProjectWithMetadata[][]> = new Promise(() => {});

	// On search set request to never resolve so the loading animation is shown before the debounce
	$: search, (request = new Promise(() => {}));

	const onSearch = () => {
		page = 0;

		request = new Promise((res, rej) =>
			fetch(
				`/api/project?where=${JSON.stringify({
					title: {
						contains: search.trim(),
						mode: "insensitive"
					},
					visible: true,
					skills: filters.length ? { hasEvery: filters } : undefined
				} as Prisma.ProjectWhereInput)}`
			)
				.then((res) => res.json())
				.then(async (projects: App.ProjectWithMetadata[]) => {
					// Random search sampling so the search data isn't spammed
					if (analytics && filters.length && Math.random() < 0.2)
						await analytics.track("project_search", {
							tech_skills: filters
						});

					// Put projects into pairs of 2 or reject if there's no results
					projects.length
						? res(
								projects
									.map((project, i) => {
										if (i % 2 === 0)
											return i === projects.length - 1
												? [project]
												: [project, projects[i + 1]];
										else return [];
									})
									.filter((project) => project.length)
						  )
						: rej();
				})
		);
	};

	// Once mounted check if there's any URL search params, if so, input them
	onMount(async () => {
		const param = new URLSearchParams(window.location.search).get("search");
		param && (search = param);

		if (!data.track) return;

		analytics = await import("$lib/analytics")
			.then(({ analytics }) => analytics)
			.catch(() => undefined);
	});

	// Track if a project was clicked on and what filters were used
	const trackProject = async (id: string) =>
		filters.length &&
		analytics &&
		(await analytics.track("project_click", {
			id,
			tech_skills: filters
		}));
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<Hero
	class="from-pink-light to-pink-dark"
	title="Projects from personal to professional."
	src="/assets/projects/projects.webm"
>
	Find skills in action by <strong>uncovering</strong> our projects and the team
	behind them.
</Hero>

<Section>
	<TextHeader>Everything in one place.</TextHeader>

	<Text>
		Team Tomorrow has used a wide variety of technologies and used a broad
		range of ideas to create a new generation of what defines a successful,
		modern, and maintainable project. Searching through these projects is
		easier than ever, you can filter based on skill or also immediately
		search for what looking for.
	</Text>
</Section>

<Section filled={true}>
	<MajorHeader>Our Projects</MajorHeader>

	<div class="flex flex-col gap-4 max-w-screen-lg mx-auto w-full">
		<FilterTitle />

		<SearchBar
			bind:search
			on:input={() => {
				// Update search URL parameters on input
				const url = new URL(window.location.href);
				if (search.trim().length)
					url.searchParams.set("search", search);
				else url.searchParams.delete("search");

				history.replaceState(null, "", url);

				request = new Promise(() => {});
			}}
			on:search={onSearch}
			placeholder="Search projects..."
		/>

		<Dropdown
			bind:selected={filters}
			radio={false}
			required={false}
			options={techSkills}
			selectedItems={[]}
			on:change={onSearch}
		>
			<Wrench class="h-8 w-8" />
		</Dropdown>

		<Seperator />

		<div class="h-[70rem]">
			<Scrollable
				class="before:from-gray-900 after:to-gray-900"
				arrows={true}
			>
				{#await request}
					<div
						class="h-14 flex animate-pulse items-center gap-4 justify-center bg-gray-500 rounded-lg py-4 px-6 shrink-0"
					>
						<div class="rounded-full bg-gray-400 w-10 h-10" />
						<div class="rounded-full bg-gray-400 w-10 h-10" />
					</div>
				{:then projects}
					{#each projects as projectPair, i}
						<ProjectFilter
							{projectPair}
							current={page === i}
							on:click={() => (page = i)}
						/>
					{/each}
				{:catch}
					<!-- Not catching this throws an error in the console, since slot will never be used here it's being used as an empty element -->
					<slot />
				{/await}
			</Scrollable>

			<div
				class="flex flex-col items-center max-w-xl mx-auto gap-14 my-12 lg:my-20"
			>
				{#await request}
					<ProjectLoading />
				{:then projects}
					{#each projects as projectPair, i}
						{#if page === i}
							<ProjectPreview
								on:click={async () =>
									await trackProject(projectPair[0].id)}
								project={projectPair[0]}
							/>

							{#if projectPair.length > 1}
								<ProjectPreview
									on:click={async () =>
										await trackProject(projectPair[1].id)}
									project={projectPair[1]}
								/>
							{/if}
						{/if}
					{/each}
				{:catch}
					<h1
						in:fly={{ duration: 300, y: 30 }}
						class="text-center font-semibold text-2xl"
					>
						No results
					</h1>
				{/await}
			</div>
		</div>
	</div>
</Section>
