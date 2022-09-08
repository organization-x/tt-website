<script lang="ts">
	import type { Project, ProjectAuthor, Skill } from "@prisma/client";

	import Aws from "./icons/Aws.svelte";
	import React from "./icons/React.svelte";
	import Python from "./icons/Python.svelte";
	import Pytorch from "./icons/Pytorch.svelte";
	import JavaScript from "./icons/JavaScript.svelte";
	import TensorFlow from "./icons/TensorFlow.svelte";
	import GoogleCloud from "./icons/GoogleCloud.svelte";

	export let project: Project;

	// TODO: Make a better system for this
	const getSkillIcon = (name: Skill) => {
		switch (name) {
			case "JAVASCRIPT":
				return JavaScript;
			case "PYTHON":
				return Python;
			case "REACT":
				return React;
			case "TENSORFLOW":
				return TensorFlow;
			case "PYTORCH":
				return Pytorch;
			case "GCLOUD":
				return GoogleCloud;
			case "AWS":
				return Aws;
		}
	};

	// TODO: Fetch relational data for project authors
	// This represents all the project authors that would be fetched
	const authors: ProjectAuthor[] = [
		{
			userId: "githubusername",
			projectId: "placeholder",
			role: "DESIGN"
		}
	];

	// This represents the singular user data that would be fetched using the project author user id
	const userPlaceholder = {
		id: "githubusername",
		url: "placeholder",
		name: "Bernice Lau",
		about: "I'm bernice!",
		team: "DESIGN",
		positions: ["DESIGNER"],
		skills: ["JAVASCRIPT", "GCLOUD"]
	};
</script>

<a
	href={`projects/${project.id}`}
	class="rounded-lg border-t-4 border-solid max-w-xl mx-auto overflow-hidden bg-gray-500/40 border-[{project.theme}]"
>
	<div
		class="h-32 sm:h-44 bg-center bg-no-repeat bg-cover relative"
		style="background-image: url({`/projects/project/${project.url}/banner.webp`});"
	>
		{#each authors as author}
			<img
				width="200"
				height="200"
				src={`/developers/user/${userPlaceholder.url}/icon.webp`}
				alt="Bernice Lau from Team Tomorrow"
				class="absolute top-2 right-2 w-10 h-10 rounded-full border-2 border-[{project.theme}] sm:w-14 sm:h-14 sm:border-4 md:top-3 md:right-3"
			/>
		{/each}
	</div>
	<div class="py-4 px-3">
		<h1 class="font-semibold text-2xl">{project.title}</h1>
		<p class="mt-2">{project.snippet}</p>
		<div class="flex gap-2 mt-4">
			{#each project.skills as icon}
				<svelte:component this={getSkillIcon(icon)} class="w-8 h-8" />
			{/each}
		</div>
	</div>
</a>
