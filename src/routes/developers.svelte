<script lang="ts">
	import Text from "$lib/components/about/Text.svelte";
	import Developer from "$lib/components/developers/Developer.svelte";
	import DeveloperFilter from "$lib/components/developers/DeveloperFilter.svelte";
	import HireStep from "$lib/components/developers/HireStep.svelte";
	import Seperator from "$lib/components/developers/Seperator.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";

	import Hero from "$lib/components/Hero.svelte";
	import Desktop from "$lib/components/icons/Desktop.svelte";
	import Python from "$lib/components/icons/Python.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import ScrollRow from "$lib/components/ScrollRow.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import SkillFilter from "$lib/components/SkillFilter.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
</script>

<svelte:head>
	<title>Developers</title>
</svelte:head>

<Hero>
	<PageTitle class="from-blue-light to-blue-dark">
		Discover who can push you forward.
	</PageTitle>

	<PageCaption>
		See who fits your needs the most and <strong>propel</strong>
		your product through our easy hiring process.
	</PageCaption>

	<img
		slot="img"
		height="1045"
		width="1554"
		src="/developers/developers.webp"
		alt="Developers with their associated skills against a dotted background"
	/>
</Hero>

<Section>
	<TextHeader>So, where do I get started?</TextHeader>

	<Text>
		We have a simple 3 step process that will get your team up and going in
		no time. Swiftly get started on hiring any team or individual developer
		from Team Tommorow so you can hit the ground running.
	</Text>

	<div class="bg-gray-500/40 p-5 mt-4 rounded-lg flex flex-col gap-8 mb-12">
		<HireStep title="Search and discover.">
			<img
				slot="img"
				height="500"
				width="500"
				src="/developers/find.webp"
				loading="lazy"
				alt="Developer profiles with an overlaying search icon"
			/>
			Search for the perfect developer to fit your needs by filtering through
			our team members below to pinpoint and/or discover your ideal candidates.
		</HireStep>
		<Seperator />
		<HireStep title="Evaluate options." side="right">
			<img
				slot="img"
				height="500"
				width="500"
				src="/developers/stats.webp"
				loading="lazy"
				alt="Developer profile with statistics bars"
			/>
			Evaluate each canditates projects, skill sets, social media, and more
			by clicking on their profile preview.
		</HireStep>
		<Seperator />
		<HireStep title="Create a contract and blastoff.">
			<img
				slot="img"
				height="500"
				width="500"
				src="/developers/send.webp"
				loading="lazy"
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

		<ScrollRow class="mt-6">
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

		<SearchBar />

		<ScrollRow class="mt-6">
			<DeveloperFilter name="Bernice" current={true}>
				<img
					height="200"
					width="200"
					src="/bernice.webp"
					loading="lazy"
					alt="Bernice Lau from Team Tomorrow"
					class="rounded-full w-10"
				/>
			</DeveloperFilter>
			<DeveloperFilter name="Bernice" current={false}>
				<img
					height="200"
					width="200"
					src="/bernice.webp"
					loading="lazy"
					alt="Bernice Lau from Team Tomorrow"
					class="rounded-full w-10"
				/>
			</DeveloperFilter>
			<DeveloperFilter name="Bernice" current={false}>
				<img
					height="200"
					width="200"
					src="/bernice.webp"
					loading="lazy"
					alt="Bernice Lau from Team Tomorrow"
					class="rounded-full w-10"
				/>
			</DeveloperFilter>
		</ScrollRow>

		<div class="overflow-auto scrollbar-hidden snap-x snap-mandatory my-12">
			<Developer
				info={{
					name: "Bernice Lau",
					role: "Designer",
					src: "./bernice.webp",
					alt: "Bernice Lau from Team Tomorrow",
					href: "/bernicelau"
				}}
			>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit.
				Dolorum ex cumque quae! Eligendi labore atque excepturi maxime
				ducimus velit ipsam nobis aut!
			</Developer>
		</div>
	</div>
</Section>
