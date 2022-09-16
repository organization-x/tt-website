<script lang="ts">
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import ScrollRow from "$lib/components/ScrollRow.svelte";
	import Python from "$lib/components/icons/Python.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";
	import ProjectBlog from "$lib/components/ProjectBlog.svelte";
	import SkillFilter from "$lib/components/SkillFilter.svelte";
	import ProjectFilter from "$lib/components/projects/index/ProjectFilter.svelte";

	import type { Project } from "@prisma/client";

	// TODO: Fetch data using prisma
	const placeholder: Project = {
		id: "ttwebsiteontop", // cuid
		title: "Project",
		snippet:
			"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus corporis unde veritatis, exercitationem beatae cumque voluptate laborum earum corrupti reiciendis, omnis placeat architecto libero, aspernatur rem dolor nesciunt com ea.",
		theme: "3B84D6",
		url: "placeholder",
		date: new Date(),
		skills: ["JavaScript", "Google_Cloud"],
		ownerId: "",
		content: ""
	};

	const projects: Project[][] = [
		[placeholder, placeholder],
		[placeholder, placeholder]
	];
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<Hero src="/projects/index/projects.webm">
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

	<div class="max-w-screen-lg mx-auto w-full">
		<FilterTitle />

		<SearchBar />

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

		<ScrollRow class="mt-12 md:mt-20">
			{#each projects as projectPair, i}
				<ProjectFilter {projectPair} current={i === 0 ? true : false} />
			{/each}
		</ScrollRow>
	</div>

	<div class="flex flex-col gap-14 my-12 lg:my-20">
		<ProjectBlog project={placeholder} />
		<ProjectBlog project={placeholder} />
	</div>
</Section>
