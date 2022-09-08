<script lang="ts">
	import type { User } from "@prisma/client";

	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import ScrollRow from "$lib/components/ScrollRow.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import Python from "$lib/components/icons/Python.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Desktop from "$lib/components/icons/Desktop.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import SkillFilter from "$lib/components/SkillFilter.svelte";
	import HireStep from "$lib/components/developers/index/HireStep.svelte";
	import StepImage from "$lib/components/developers/index/StepImage.svelte";
	import Developer from "$lib/components/developers/index/Developer.svelte";
	import DeveloperFilter from "$lib/components/developers/index/DeveloperFilter.svelte";

	// TODO: Fetch data using prisma
	const placeholder: User = {
		id: "githubusername",
		url: "placeholder",
		name: "Bernice Lau",
		about: "I'm bernice!",
		team: "DESIGN",
		positions: ["DESIGNER"],
		skills: ["JAVASCRIPT", "GCLOUD"]
	};
</script>

<svelte:head>
	<title>Developers</title>
</svelte:head>

<Hero src="/developers/index/developers.webm">
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
				src="/developers/index/find.webp"
				alt="Developer profiles stacked ontop of eachother"
			/>
			Search for the perfect developer to fit your needs by filtering through
			our team members below to pinpoint and/or discover your ideal candidates.
		</HireStep>

		<Seperator />

		<HireStep title="Evaluate options." side="right">
			<StepImage
				slot="image"
				src="/developers/index/stats.webp"
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
				src="/developers/index/send.webp"
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

		<SearchBar />

		<ScrollRow class="mt-6">
			<SkillFilter name="Frontend Developer" current={true}>
				<Desktop class="h-6 w-6" />
			</SkillFilter>
			<SkillFilter name="Frontend Developer" current={false}>
				<Desktop class="h-6 w-6" />
			</SkillFilter>
			<SkillFilter name="Frontend Developer" current={false}>
				<Desktop class="h-6 w-6" />
			</SkillFilter>
		</ScrollRow>

		<ScrollRow class="mt-6 mb-12">
			<SkillFilter name="Python" current={true}>
				<Python class="h-6 w-6" />
			</SkillFilter>
			<SkillFilter name="Python" current={false}>
				<Python class="h-6 w-6" />
			</SkillFilter>
			<SkillFilter name="Python" current={false}>
				<Python class="h-6 w-6" />
			</SkillFilter>
		</ScrollRow>

		<Seperator />

		<ScrollRow class="mt-12">
			<DeveloperFilter current={true} info={placeholder} />
			<DeveloperFilter current={false} info={placeholder} />
			<DeveloperFilter current={false} info={placeholder} />
		</ScrollRow>

		<div
			class="flex gap-32 max-w-xl mx-auto overflow-auto scrollbar-hidden snap-x snap-mandatory my-12"
		>
			<Developer info={placeholder}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit.
				Repellat unde possimus expedita minima iusto excepturi vero
				facere dolorem ducimus, iste minus velit, distinctio sed illum
				labore quos libero impedit sequi.
			</Developer>
			<Developer info={placeholder}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit.
				Repellat unde possimus expedita minima iusto excepturi vero
				facere dolorem ducimus, iste minus velit, distinctio sed illum
				labore quos libero impedit sequi.
			</Developer>
			<Developer info={placeholder}>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit.
				Repellat unde possimus expedita minima iusto excepturi vero
				facere dolorem ducimus, iste minus velit, distinctio sed illum
				labore quos libero impedit sequi.
			</Developer>
		</div>
	</div>
</Section>
