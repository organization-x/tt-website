<script lang="ts">
	import { getContext } from "svelte";
	import { fly } from "svelte/transition";

	import { techSkills } from "$lib/enums";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Wrench from "$lib/components/icons/general/Wrench.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";
	import ProjectLoading from "$lib/components/ProjectLoading.svelte";

	import type { PageData } from "./$types";
	import type { Prisma, TechSkill } from "@prisma/client";

	export let data: PageData;

	const firstName = data.userPage.name.split(" ")[0];

	// Create a timestamp so the images from Cloudflare don't cache
	const timestamp = getContext("timestamp") as string;

	let search = "";
	let filters: TechSkill[] = [];
	let request: Promise<App.ProjectWithMetadata[]> = new Promise(() => {});

	// On search set request to never resolve so the loading animation is shown before the debounce
	$: search, (request = new Promise(() => {}));

	const onSearch = () =>
		(request = new Promise((res, rej) =>
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
				.then((projects: App.ProjectWithMetadata[]) =>
					projects.length ? res(projects) : rej()
				)
		));
</script>

<div class="relative pt-18 px-4 lg:px-10">
	<img
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{data
			.userPage.id}/banner?{timestamp}"
		width="1920"
		height="1080"
		alt="{data.userPage.name}'s banner"
		class="-z-10 absolute bg-gray-400 top-0 inset-0 object-cover object-center w-full h-32 lg:h-44"
	/>

	<div class="flex flex-col gap-2 items-center mb-6">
		<img
			width="512"
			height="512"
			src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{data
				.userPage.id}/avatar?{timestamp}"
			alt="{data.userPage.name}'s avatar"
			class="border-4 mt-4 border-black bg-gray-400 box-content object-cover object-center w-28 h-28 rounded-full lg:w-32 lg:mx-0 lg:h-32 lg:mb-2"
		/>

		<GradientText
			class="from-green-light to-green-dark text-center font-bold text-3xl break-words w-full lg:text-start lg:max-w-[15rem]"
		>
			{firstName}'s Projects
		</GradientText>
	</div>

	<div class="flex flex-col gap-4">
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
			lightBg={false}
		/>

		<Dropdown
			bind:selected={filters}
			radio={false}
			required={false}
			options={techSkills}
			selectedItems={[]}
			lightBg={false}
			on:change={onSearch}
		>
			<Wrench class="h-6 w-6" />
		</Dropdown>

		<div class="w-full h-0.5 rounded-full bg-gray-900" />
	</div>

	<!-- TODO: Desktop scaling -->
	<!-- TODO: Global Analytics -->
	<!-- TODO: Kudos implementation -->
	<!-- TODO: User feedback -->
	<!-- TODO: Discord list -->

	<div class="flex flex-col gap-14 mt-10 min-h-[78rem]">
		{#await request}
			<ProjectLoading />
		{:then projects}
			{#each projects as project}
				<ProjectPreview {project} lightBg={false} />
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
