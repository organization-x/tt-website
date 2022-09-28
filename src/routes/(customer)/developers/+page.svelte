<script lang="ts">
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import { softSkills, techSkills } from "$lib/enums";
	import Seperator from "$lib/components/Seperator.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import SkillFilter from "$lib/components/SkillFilter.svelte";
	import HireStep from "$lib/components/developers/index/HireStep.svelte";
	import StepImage from "$lib/components/developers/index/StepImage.svelte";
	import Developer from "$lib/components/developers/index/Developer.svelte";
	import DeveloperFilter from "$lib/components/developers/index/DeveloperFilter.svelte";

	import { getIcon } from "$lib/getIcon";
	import type { SoftSkill, TechSkill } from "@prisma/client";

	let request: Promise<App.ProjectWithAuthors[][]> = new Promise(() => {});

	let page = 0;
	let search = "";
	let filters = new Set<SoftSkill | TechSkill>();

	// On search set request to never resolve so the loading animation is shown before the debounce
	$: search, (request = new Promise(() => {}));

	const onSearch = () => {
		const filterArray = Array.from(filters);

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
						skills: filterArray.length
							? { hasEvery: filterArray }
							: undefined
					}
				} as App.UserSearchRequest)
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
	<title>Developers</title>
</svelte:head>

<Hero src="/assets/developers/index/developers.webm">
	<PageTitle class="from-blue-light to-blue-dark">
		Discover who can push you forward.
	</PageTitle>

	<PageCaption>
		See who fits your needs the most and <strong>propel</strong>
		your product through our easy hiring process.
	</PageCaption>
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
		<HireStep title="Search and discover.">
			<StepImage
				slot="image"
				src="/assets/developers/index/find.webp"
				alt="Developer profiles stacked ontop of eachother"
			/>
			Search for the perfect developer to fit your needs by filtering through
			our team members below to pinpoint and/or discover your ideal candidates.
		</HireStep>

		<Seperator />

		<HireStep title="Evaluate options." side="right">
			<StepImage
				slot="image"
				src="/assets/developers/index/stats.webp"
				alt="Developer profile with statistics bars"
			/>
			Evaluate each canditates projects, skill sets, social media, and more
			by clicking on their profile preview. And figure out who intrigues you
			most.
		</HireStep>

		<Seperator />

		<HireStep title="Create a contract and blastoff.">
			<StepImage
				slot="image"
				src="/assets/developers/index/send.webp"
				alt="Developer profile with statistics bars"
			/>
			Contact us to schedule a virtual meeting for more information on pricing
			and next steps. We usually get back to you within 2 buisness days.
		</HireStep>
	</div>
</Section>

<Section filled={true}>
	<MajorHeader>Search Developers</MajorHeader>

	<div class="max-w-screen-lg mx-auto w-full">
		<FilterTitle />

		<SearchBar bind:search placeholder="Search developers..." />

		<Scrollable
			class="before:from-gray-900 after:to-gray-900"
			arrows={true}
		>
			{#each softSkills as skill}
				<SkillFilter
					on:click={() => {
						// Add a filter if its not there and delete it if it's not, then tell
						// the component whether it's active or or not based off the initial has value
						const has = filters.has(skill);
						has ? filters.delete(skill) : filters.add(skill);
						filters = filters;

						onSearch();
					}}
					name={skill.replace("_", " ")}
					active={filters.has(skill)}
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
						const has = filters.has(skill);
						has ? filters.delete(skill) : filters.add(skill);
						filters = filters;

						onSearch();
					}}
					name={skill.replace("_", " ")}
					active={filters.has(skill)}
				>
					<svelte:component this={getIcon(skill)} class="h-6 w-6" />
				</SkillFilter>
			{/each}
		</Scrollable>

		<Seperator />

		<Scrollable class="before:from-gray-900 after:to-gray-900">
			<DeveloperFilter current={true} user={placeholder} />
			<DeveloperFilter current={false} user={placeholder} />
			<DeveloperFilter current={false} user={placeholder} />
		</Scrollable>

		<div
			class="flex gap-32 max-w-xl mx-auto overflow-auto scrollbar-hidden snap-x snap-mandatory my-12"
		>
			<Developer user={placeholder}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit.
				Repellat unde possimus expedita minima iusto excepturi vero
				facere dolorem ducimus, iste minus velit, distinctio sed illum
				labore quos libero impedit sequi.
			</Developer>
			<Developer user={placeholder}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit.
				Repellat unde possimus expedita minima iusto excepturi vero
				facere dolorem ducimus, iste minus velit, distinctio sed illum
				labore quos libero impedit sequi.
			</Developer>
			<Developer user={placeholder}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit.
				Repellat unde possimus expedita minima iusto excepturi vero
				facere dolorem ducimus, iste minus velit, distinctio sed illum
				labore quos libero impedit sequi.
			</Developer>
		</div>
	</div>
</Section>
