<script lang="ts">
	import { fly } from "svelte/transition";

	import { getIcon } from "$lib/getIcon";

	export let project: App.ProjectWithMetadata;
</script>

<a
	on:click
	in:fly={{ duration: 300, y: 50 }}
	href="/projects/{project.url}"
	rel="noreferrer noopener"
	class="rounded-lg border-t-4 overflow-hidden bg-gray-500/40 w-full block"
	style="border-color: #{project.theme}"
>
	<div class="relative">
		<!-- TODO: Replace placeholders -->

		<img
			src="/assets/projects/project/placeholder/banner.webp"
			width="1920"
			height="1080"
			loading="lazy"
			alt="Banner for '{project.title}'"
			class="object-cover object-center w-full h-32"
		/>

		<div
			class="absolute top-2 right-2 left-0 justify-end pr-6 flex sm:pr-8 md:top-3 md:right-3"
		>
			{#each project.authors as author, i}
				{#if i <= 4}
					<img
						width="200"
						height="200"
						src="/assets/developers/user/placeholder/icon.webp"
						alt="{author.user.name}'s avatar"
						class="w-10 h-10 -mr-6 sm:-mr-8 rounded-full border-2 sm:w-14 sm:h-14 sm:border-4"
						style="border-color: #{project.theme}; z-index: {project
							.authors.length - i}"
					/>
				{/if}
			{/each}
		</div>
	</div>

	<div class="flex flex-col py-4 px-3 min-h-72">
		<h1 class="font-semibold text-2xl">{project.title}</h1>
		<p class="mt-2">{project.description}</p>
		<div class="flex gap-2 mt-auto pt-4">
			{#each project.skills as icon}
				<svelte:component this={getIcon(icon)} class="w-8 h-8" />
			{/each}
		</div>
	</div>
</a>
