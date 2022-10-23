<script lang="ts">
	import GradientText from "$lib/components/GradientText.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	let projects = data.projects;

	if (data.user.pinnedProject) {
		projects = projects.filter(
			(project) => project.id !== data.user.pinnedProject?.id
		);
		projects.unshift(data.user.pinnedProject);
	}
</script>

<svelte:head>
	<title>
		{data.user.name}'s Projects &ndash; Team Tomorrow
	</title>
</svelte:head>

<!-- TODO: Replace placeholders -->

<div class="relative">
	<div
		class="h-32 absolute inset-0 bottom-auto bg-cover bg-center -z-10"
		style="background-image: url(/assets/projects/project/placeholder/banner.webp);"
	/>
</div>

<div
	class="px-8 max-w-screen-md lg:max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4"
>
	<div class="mt-16 px-4 lg:w-60 xl:w-70 2xl:w-80">
		<div class="top-8 sticky">
			<img
				src="/assets/projects/project/placeholder/banner.webp"
				alt="Profile"
				class="w-32 h-32 rounded-full border-4 border-black"
			/>

			<div class="flex flex-col gap-4 mt-2">
				<GradientText
					class="from-green-light to-green-dark font-bold text-3xl"
				>
					{data.user.name}'s Projects
				</GradientText>
				<p>
					{data.user.about}
				</p>
			</div>
		</div>
	</div>

	{#if projects?.length}
		<div
			class="flex-1 grid lg:grid-cols-2 lg:mt-36 [align-items:start] gap-4 mx-4"
		>
			{#each projects as project}
				<ProjectPreview {project} />
			{/each}
		</div>
	{:else}
		<div class="flex-1 mx-4">
			<p class="lg:mt-36">This user doesn't have any projects!</p>
		</div>
	{/if}
</div>
