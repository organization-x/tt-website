<script lang="ts">
	import Text from "$lib/components/about/Text.svelte";
	import SkillFilter from "$lib/components/SkillFilter.svelte";
	import ScrollRow from "$lib/components/ScrollRow.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Python from "$lib/components/icons/Python.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import ProjectFilter from "$lib/components/projects/ProjectFilter.svelte";
	import FilterTitle from "$lib/components/FilterTitle.svelte";
	import ProjectBlog from "$lib/components/ProjectBlog.svelte";
	import React from "$lib/components/icons/React.svelte";
	import JavaScript from "$lib/components/icons/JavaScript.svelte";
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<Hero>
	<PageTitle class="from-pink-light to-pink-dark">
		Projects from personal to professional.
	</PageTitle>

	<PageCaption>
		Find skills in action by <strong>uncovering</strong> our projects and the
		team behind them.
	</PageCaption>

	<video slot="img" autoplay muted playsinline>
		<source src="/projects/projects.webm" type="video/webm" />
		<source src="/projects/projects.mp4" type="video/mp4" />
	</video>
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

		<SearchBar />

		<ScrollRow class="mt-12 md:mt-20">
			<ProjectFilter current={true}>
				<img
					src="/blog.webp"
					alt="Random shapes and colors in the formation of a hallway"
					loading="lazy"
					class="rounded-full w-10"
				/>
				<img
					src="/blog.webp"
					alt="Random shapes and colors in the formation of a hallway"
					loading="lazy"
					class="rounded-full w-10"
				/>
			</ProjectFilter>
			<ProjectFilter current={false}>
				<img
					src="/blog.webp"
					alt="Random shapes and colors in the formation of a hallway"
					loading="lazy"
					class="rounded-full w-10"
				/>
				<img
					src="/blog.webp"
					alt="Random shapes and colors in the formation of a hallway"
					loading="lazy"
					class="rounded-full w-10"
				/>
			</ProjectFilter>
		</ScrollRow>
	</div>

	<div class="flex flex-col gap-8 mt-12 lg:mt-20">
		<ProjectBlog
			title="Project"
			class="border-[#EFF24C]"
			img="./blog.webp"
			icons={[React, JavaScript]}
		>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus
			corporis unde veritatis, exercitationem beatae cumque voluptate
			laborum earum corrupti reiciendis, omnis placeat architecto libero,
			aspernatur rem dolor nesciunt com ea.
		</ProjectBlog>
		<ProjectBlog
			title="Project"
			class="border-[#EFF24C]"
			img="./blog.webp"
			icons={[React, JavaScript]}
		>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus
			corporis unde veritatis, exercitationem beatae cumque voluptate
			laborum earum corrupti reiciendis, omnis placeat architecto libero,
			aspernatur rem dolor nesciunt com ea.
		</ProjectBlog>
	</div>
</Section>
