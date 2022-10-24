<script lang="ts">
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

	import { getIcon } from "$lib/getIcon";
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import { softSkills, techSkills } from "$lib/enums";
	import Seperator from "$lib/components/Seperator.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import SkillFilter from "$lib/components/SkillFilter.svelte";
	import DevTagLoading from "$lib/components/DevTagLoading.svelte";
	import HireStep from "$lib/components/developers/index/HireStep.svelte";
	import Developer from "$lib/components/developers/index/Developer.svelte";
	import DeveloperFilter from "$lib/components/developers/index/DevFilter.svelte";

	import type { PageData } from "./$types";
	import type { AnalyticsInstance } from "analytics";
	import type { SoftSkill, TechSkill } from "@prisma/client";

	export let data: PageData;

	let page = 0;
	let search = "";
	let softSkillFilter = new Set<SoftSkill>();
	let techSkillFilter = new Set<TechSkill>();
	let analytics: AnalyticsInstance | undefined;
	let request: Promise<App.UserWithMetadata[]> = new Promise(() => {});

	// On search set request to never resolve so the loading animation is shown before the debounce
	$: search, (request = new Promise(() => {})), (page = 0);

	const onSearch = () => {
		request = new Promise((res, rej) =>
			fetch("/api/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					where: {
						name: {
							contains: search.trim(),
							mode: "insensitive"
						},
						softSkills: softSkillFilter.size
							? { hasEvery: Array.from(softSkillFilter) }
							: undefined,
						techSkills: techSkillFilter.size
							? { hasEvery: Array.from(techSkillFilter) }
							: undefined,
						visible: true
					}
				} as App.UserSearchRequest)
			})
				.then((res) => res.json())
				.then(async (users: App.UserWithMetadata[]) => {
					// Random search sampling so the search data isn't spammed
					if (
						analytics &&
						(softSkillFilter.size || techSkillFilter.size) &&
						Math.random() < 0.2
					)
						await analytics.track("user_search", {
							soft_skills: Array.from(softSkillFilter),
							tech_skills: Array.from(techSkillFilter)
						});

					return users.length ? res(users) : rej();
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

	// Track if a user was clicked on and what filters were used
	const trackUser = async (id: string) =>
		analytics &&
		(softSkillFilter.size || techSkillFilter.size) &&
		(await analytics.track("user_click", {
			id,
			soft_skills: Array.from(softSkillFilter),
			tech_skills: Array.from(techSkillFilter)
		}));
</script>

<svelte:head>
	<title>Developers</title>
</svelte:head>

<Hero
	class="from-blue-light to-blue-dark"
	title="Discover who can push you forward."
	src="/assets/developers/index/developers.webm"
>
	See who fits your needs the most and <strong>propel</strong>
	your product through our easy hiring process.
</Hero>

<Section>
	<TextHeader>So, where do I get started?</TextHeader>

	<Text>
		We have a simple 3 step process that will get your team up and going in
		no time. Swiftly get started on hiring any team or individual developer
		from Team Tommorow so you can hit the ground running.
	</Text>

	<div
		class="bg-gray-500/40 p-5 mt-4 rounded-lg flex flex-col gap-8 mb-12 max-w-xl mx-auto"
	>
		<HireStep
			title="Search and discover."
			src="/assets/developers/index/find.webp"
			alt="Developer profiles stacked ontop of eachother"
		>
			Search for the perfect developer to fit your needs by filtering
			through our team members below to pinpoint your ideal candidates.
		</HireStep>

		<Seperator />

		<HireStep
			title="Evaluate options."
			side="right"
			src="/assets/developers/index/stats.webp"
			alt="Developer profile with statistics bars"
		>
			Evaluate each canditates projects, skill sets, social media, and
			more by clicking on their profile preview. And figure out who
			intrigues you most.
		</HireStep>

		<Seperator />

		<HireStep
			title="Create a contract and blastoff."
			src="/assets/developers/index/send.webp"
			alt="Developer profile with statistics bars"
		>
			Contact us to schedule a virtual meeting for more information on
			pricing and next steps. We usually get back to you within 2 buisness
			days.
		</HireStep>
	</div>
</Section>

<Section filled={true}>
	<MajorHeader>Search Developers</MajorHeader>

	<div class="max-w-screen-lg mx-auto w-full flex flex-col gap-4">
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
			placeholder="Search developers..."
		/>

		<Scrollable
			class="before:from-gray-900 after:to-gray-900"
			arrows={true}
		>
			{#each softSkills as skill}
				<SkillFilter
					on:click={() => {
						// Add a filter if its not there and delete it if it's not, then tell
						// the component whether it's active or or not based off the initial has value
						const has = softSkillFilter.has(skill);
						has
							? softSkillFilter.delete(skill)
							: softSkillFilter.add(skill);
						softSkillFilter = softSkillFilter;

						onSearch();
					}}
					name={skill.replace("_", " ")}
					active={softSkillFilter.has(skill)}
				>
					<svelte:component this={getIcon(skill)} class="h-6 w-6" />
				</SkillFilter>
			{/each}
		</Scrollable>

		<Scrollable
			class="before:from-gray-900 after:to-gray-900"
			arrows={true}
		>
			{#each techSkills as skill}
				<SkillFilter
					on:click={() => {
						// Add a filter if its not there and delete it if it's not, then tell
						// the component whether it's active or or not based off the initial has value
						const has = techSkillFilter.has(skill);
						has
							? techSkillFilter.delete(skill)
							: techSkillFilter.add(skill);
						techSkillFilter = techSkillFilter;

						onSearch();
					}}
					name={skill.replace("_", " ")}
					active={techSkillFilter.has(skill)}
				>
					<svelte:component this={getIcon(skill)} class="h-6 w-6" />
				</SkillFilter>
			{/each}
		</Scrollable>

		<Seperator />

		<div class="min-h-[100rem] md:min-h-[73rem]">
			<Scrollable
				class="before:from-gray-900 after:to-gray-900"
				arrows={true}
			>
				{#await request}
					<div
						class="h-14 flex animate-pulse items-center gap-4 justify-center bg-gray-500 rounded-lg px-4 shrink-0 w-56"
					>
						<div class="rounded-full bg-gray-400 w-10 h-10" />
						<div class="rounded-full bg-gray-400 w-32 h-5" />
					</div>
				{:then users}
					{#each users as user, i}
						<DeveloperFilter
							{user}
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
					<div
						class="bg-gray-500 animate-pulse flex flex-col gap-6 rounded-lg p-6 max-w-xl mx-auto shrink-0 w-full hmin-h-[72rem] md:min-h-[54rem]"
					>
						<div
							class="flex flex-col gap-6 items-center md:flex-row"
						>
							<div class="w-20 h-20 bg-gray-400 rounded-full" />
							<div
								class="flex flex-col-reverse gap-4 items-center text-center md:flex-col md:text-start md:items-start"
							>
								<div
									class="rounded-full h-7 w-56 bg-gray-400"
								/>
								<div
									class="rounded-full h-4 mt-1 w-24 bg-gray-400"
								/>
							</div>
						</div>

						<div
							class="flex flex-col items-center px-3 gap-4 md:items-start md:px-0"
						>
							<div class="rounded-sm h-2 w-full bg-gray-400" />
							<div class="rounded-sm h-2 w-full bg-gray-400" />
							<div class="rounded-sm h-2 w-full bg-gray-400" />
							<div class="rounded-sm h-2 w-full bg-gray-400" />
							<div class="rounded-sm h-2 w-32 bg-gray-400" />
						</div>

						<div class="mt-4 flex flex-col items-center gap-4">
							<div class="rounded-full h-5 w-44 bg-gray-400" />

							<div
								class="bg-gray-800 shrink-0 w-full rounded-lg p-3 pt-0 mb-5 min-h-72 md:min-h-[15rem] lg:flex lg:min-h-[12rem] lg:p-4"
							>
								<div
									class="h-32 md:h-24 bg-gray-400 -mx-3 border-t-4 border-gray-500/40 rounded-t-lg lg:w-24 lg:h-auto lg:rounded-lg lg:mx-0 lg:shrink-0 lg:border-none"
								/>
								<div
									class="flex flex-col gap-4 mt-3 lg:ml-2 lg:w-full"
								>
									<div
										class="rounded-full h-5 w-44 bg-gray-400"
									/>
									<div
										class="rounded-sm h-2 w-full bg-gray-400"
									/>
									<div
										class="rounded-sm h-2 w-full bg-gray-400"
									/>
									<div
										class="rounded-sm h-2 w-full bg-gray-400"
									/>
									<div
										class="rounded-sm h-2 w-full bg-gray-400 md:hidden"
									/>
									<div
										class="rounded-sm h-2 w-full bg-gray-400 md:hidden"
									/>
									<div
										class="rounded-sm h-2 w-32 bg-gray-400"
									/>
								</div>
							</div>

							<div class="rounded-full h-5 w-32 bg-gray-400" />

							<div
								class="flex flex-col gap-4 md:grid md:grid-cols-2 w-full"
							>
								<DevTagLoading />
								<DevTagLoading />
							</div>

							<div
								class="rounded-full h-5 w-32 bg-gray-400 mt-4"
							/>

							<div
								class="flex flex-col gap-4 md:grid md:grid-cols-2 w-full"
							>
								<DevTagLoading />
								<DevTagLoading />
								<DevTagLoading />
								<DevTagLoading />
							</div>
						</div>
					</div>
				{:then users}
					{#each users as user, i}
						{#if page === i}
							<Developer
								on:click={async () => await trackUser(user.id)}
								{user}
							/>
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
