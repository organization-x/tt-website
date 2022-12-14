<script lang="ts">
	import SearchBar from "$lib/components/SearchBar.svelte";
	import Pin from "$lib/components/icons/general/Pin.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";

	import type { TechSkill } from "@prisma/client";

	export let userId: string;
	export let projects: App.ProjectWithMetadata[];
	export let pinnedProject: App.ProjectWithMetadata | undefined;

	let search = "";
	let filters: TechSkill[] = [];

	// Create an array of filtered projects based on the search query
	$: filteredProjects = projects.filter(({ title, skills, id }) =>
		title.toLowerCase().includes(search.trim().toLowerCase()) &&
		filters.every((skill) => skills.includes(skill)) &&
		pinnedProject
			? pinnedProject.id !== id
			: true
	);
</script>

<div class="w-full mx-auto lg:max-w-screen-xl">
	<h1 class="text-2xl font-semibold ml-1">Projects</h1>

	<div class="bg-gray-900 p-4 rounded-lg mt-4 flex flex-col min-h-120">
		{#if pinnedProject}
			<div
				class="flex font-semibold justify-center items-center gap-3 mb-6 mt-2"
			>
				<Pin class="w-5 h-5" />
				<h1 class="text-lg">Pinned Project</h1>
			</div>

			<ProjectPreview project={pinnedProject} {userId} />
		{/if}

		<div
			class:mt-6={pinnedProject && projects.length}
			class:m-auto={!projects.length}
			class:gap-6={projects.length === 2}
			class:flex={projects.length >= 2}
			class:flex-col={projects.length >= 2}
		>
			{#if projects.length > 2}
				<SearchBar bind:search placeholder="Search projects..." />

				<Scrollable
					vertical={true}
					class="h-[37.3rem] mt-6 before:from-gray-900 after:to-gray-900"
					innerClass="scrollbar-hidden"
				>
					{#each filteredProjects as project}
						<ProjectPreview {project} {userId} />
					{:else}
						<h1 class="text-center font-semibold text-xl">
							No results
						</h1>
					{/each}
				</Scrollable>
			{:else if projects.length || pinnedProject}
				{#each filteredProjects as project}
					<ProjectPreview {project} {userId} />
				{/each}
			{:else}
				<h1 class="font-semibold text-xl">No Projects</h1>
			{/if}
		</div>
	</div>
</div>
