<script lang="ts">
	import { fly } from "svelte/transition";

	import { getIcon } from "$lib/getIcon";

	export let project: App.ProjectWithAuthors;
</script>

<a
	in:fly={{ duration: 300, y: 50 }}
	href="/projects/{project.url}"
	rel="noreferrer noopener"
	class="rounded-lg border-t-4 max-w-xl overflow-hidden bg-gray-500/40 w-full"
	style="border-color: #{project.theme}"
>
	<div class="relative">
		<!-- TODO: Replace placeholders -->

		<img
			src="/projects/project/placeholder/banner.webp"
			width="1920"
			height="1080"
			alt="Banner for '{project.title}'"
			class="object-cover object-center w-full h-32 row-start-1 col-start-1"
		/>

		{#each project.authors as author}
			<img
				width="200"
				height="200"
				src="/developers/user/placeholder/icon.webp"
				alt="{author.name}'s avatar"
				class="absolute top-2 right-2 w-10 h-10 rounded-full border-2 sm:w-14 sm:h-14 sm:border-4 md:top-3 md:right-3"
				style="border-color: #{project.theme}"
			/>
		{/each}
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
