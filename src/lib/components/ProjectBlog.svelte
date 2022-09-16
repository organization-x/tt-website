<script lang="ts">
	import { getIcon } from "$lib/components/icons/getIcon";

	import type { Project, ProjectAuthor, User } from "@prisma/client";

	export let project: Project;

	// TODO: Fetch relational data for project authors
	// This represents all the project authors that would be fetched
	const authors: ProjectAuthor[] = [
		{
			userId: "githubusername",
			projectId: "placeholder",
			position: "Designer"
		}
	];

	// This represents the singular user data that would be fetched using the project author user id
	const userPlaceholder: User = {
		id: "githubusername",
		url: "placeholder",
		name: "Bernice Lau",
		about: "I'm bernice!",
		team: "Design",
		positions: ["Designer"],
		softSkills: ["Leadership"],
		techSkills: ["JavaScript"]
	};
</script>

<a
	href="projects/{project.id}"
	class="rounded-lg border-t-4 border-solid max-w-xl mx-auto overflow-hidden bg-gray-500/40"
	style="border-color: #{project.theme}"
>
	<div
		class="h-32 sm:h-44 bg-center bg-no-repeat bg-cover relative"
		style="background-image: url(/projects/project/{project.url}/banner.webp);"
	>
		{#each authors as author}
			<img
				width="200"
				height="200"
				src="/developers/user/{userPlaceholder.url}/icon.webp"
				alt="Bernice Lau's avatar"
				class="absolute top-2 right-2 w-10 h-10 rounded-full border-2 sm:w-14 sm:h-14 sm:border-4 md:top-3 md:right-3"
				style="border-color: #{project.theme}"
			/>
		{/each}
	</div>
	<div class="py-4 px-3">
		<h1 class="font-semibold text-2xl">{project.title}</h1>
		<p class="mt-2">{project.snippet}</p>
		<div class="flex gap-2 mt-4">
			{#each project.skills as icon}
				<svelte:component this={getIcon(icon)} class="w-8 h-8" />
			{/each}
		</div>
	</div>
</a>
