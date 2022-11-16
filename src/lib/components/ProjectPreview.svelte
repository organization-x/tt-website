<script lang="ts">
	import { fly } from "svelte/transition";

	import { getIcon } from "$lib/getIcon";

	// Keep track of whether these are on the profile page or not, so visual changes can be made
	export let profile = false;
	export let project: App.ProjectWithMetadata;

	const timestamp = Date.now();
</script>

<a
	on:click
	in:fly={{ duration: 300, y: 50 }}
	href="/projects/{project.url}"
	rel="noreferrer noopener"
	class:bg-gray-700={profile}
	class:bg-gray-800={!profile}
	class="rounded-lg border-t-4 overflow-hidden w-full block"
	style="border-color: #{project.theme}"
>
	<div class="relative">
		<img
			src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{project.id}/banner?{timestamp}"
			width="1920"
			height="1080"
			loading="lazy"
			alt="Banner for '{project.title}'"
			class="object-cover object-center bg-gray-400 w-full h-32"
		/>

		<div
			class="absolute flex w-full justify-end items-center top-2 right-1 pr-6 sm:pr-8"
		>
			{#each project.authors.slice(0, 5) as author, i}
				<!-- When there's only one author, so the user aht created it, hide their icon when on their profile -->
				{#if !(profile && project.authors.length === 1 && author.user.id === project.ownerId)}
					<img
						width="512"
						height="512"
						src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{author
							.user.id}/avatar?{timestamp}"
						alt="{author.user.name}'s avatar"
						class="w-10 h-10 bg-gray-400 object-cover object-center shrink-0 -mr-5 rounded-full border-2 sm:-mr-7 sm:w-12 sm:h-12 sm:border-4 md:w-14 md:h-14"
						style="border-color: #{project.theme}; z-index: {project
							.authors.length - i}"
					/>
				{/if}
			{/each}
		</div>
	</div>

	<div class="flex flex-col py-4 px-3 min-h-116">
		<h1 class="font-semibold text-2xl break-words">{project.title}</h1>
		<p class="mt-2">{project.description}</p>
		<div class="flex gap-3 mt-auto pt-4">
			{#each project.skills as icon}
				<svelte:component this={getIcon(icon)} class="w-8 h-8" />
			{/each}
		</div>
	</div>
</a>
