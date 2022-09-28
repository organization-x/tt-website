<script lang="ts">
	import { fly } from "svelte/transition";

	import { getIcon } from "$lib/getIcon";
	import { techSkills } from "$lib/enums";
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";
	import SkillFilter from "$lib/components/SkillFilter.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";
	import ProjectFilter from "$lib/components/projects/ProjectFilter.svelte";

	import type { TechSkill } from "@prisma/client";
	import ProjectLoader from "$lib/components/ProjectLoader.svelte";

	let request: Promise<App.ProjectWithAuthors[][]> = new Promise(() => {});

	let page = 0;
	let search = "";
	let filters = new Set<TechSkill>();

	// On search set request to never resolve so the loading animation is shown before the debounce
	$: search, (request = new Promise(() => {}));

	const onSearch = () => {
		const filterArray = Array.from(filters);

		request = new Promise((res, rej) =>
			fetch("/api/project", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					where: {
						title: {
							contains: search.trim(),
							mode: "insensitive"
						},
						visible: true,
						skills: filterArray.length
							? { hasEvery: filterArray }
							: undefined
					}
				} as App.ProjectSearchRequest)
			})
				.then((res) => res.json())
				.then((data: App.ProjectWithAuthors[]) => {
					// Put projects into pairs of 2 or reject if there's no results
					data.length
						? res(
								data
									.map((project, i) => {
										if (i % 2 === 0)
											return i === data.length - 1
												? [project]
												: [project, data[i + 1]];
										else return [];
									})
									.filter((project) => project.length)
						  )
						: rej();
				})
		);
	};
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<Hero src="/assets/projects/index/projects.webm">
	<PageTitle class="from-pink-light to-pink-dark">
		Projects from personal to professional.
	</PageTitle>

	<PageCaption>
		Find skills in action by <strong>uncovering</strong> our projects and the
		team behind them.
	</PageCaption>
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
			on:input={() => (request = new Promise(() => {}))}
			on:search={onSearch}
			placeholder="Search projects..."
		/>

		<Scrollable
			class="before:from-gray-900 after:to-gray-900"
			arrows={true}
		>
			{#each techSkills as skill}
				<SkillFilter
					on:click={() => {
						// Add a filter if its not there and delete it if it's not, then tell
						// the component whether it's active or or not based off the initial has value
						const has = filters.has(skill);
						has ? filters.delete(skill) : filters.add(skill);

						onSearch();

						filters = filters;
					}}
					name={skill.replace("_", " ")}
					active={filters.has(skill)}
				>
					<svelte:component this={getIcon(skill)} class="h-6 w-6" />
				</SkillFilter>
			{/each}
		</Scrollable>

		<Seperator />

		<!-- Stop CLS when search results are changing -->
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
					<ProjectLoader />
				{:then projects}
					{#each projects as projectPair, i}
						{#if page === i}
							<ProjectPreview project={projectPair[0]} />

							{#if projectPair.length > 1}
								<ProjectPreview project={projectPair[1]} />
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
