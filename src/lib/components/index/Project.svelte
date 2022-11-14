<script lang="ts">
	import { getIcon } from "$lib/getIcon";
	import Scrollable from "../Scrollable.svelte";
	import Button from "$lib/components/Button.svelte";
	import Author from "$lib/components/Author.svelte";

	export let project: App.ProjectWithMetadata;
	export let trackClick: (name: string) => void;
</script>

<div
	class="mt-20 lg:mt-32 lg:grid lg:project-cols lg:gap-x-8 lg:[&:nth-child(even)>:first-child]:order-1"
>
	<div class="bg-gray-900 p-4 rounded-lg relative mx-auto max-w-lg lg:px-8">
		<slot name="svg" />

		<h1 class="text-3xl font-semibold text-center mt-10">
			{project.title}
		</h1>

		<p class="mt-6 text-center lg:text-base">
			{project.description}
		</p>

		<div class="flex gap-2 items-center justify-center mt-8 mb-6 lg:my-8">
			{#each project.skills as skill}
				<svelte:component this={getIcon(skill)} class="w-8 h-8" />
			{/each}
		</div>

		<Scrollable
			class="before:from-gray-900 after:to-gray-900 w-fit mx-auto lg:hidden"
		>
			{#each project.authors as author}
				<Author {author} />
			{/each}
		</Scrollable>

		<Button
			on:click={() =>
				trackClick(`project_${project.url.replaceAll("-", "_")}`)}
			href={project.url}
			class="w-full mt-6 bg-gray-800/100 text-white py-4 lg:mt-0"
		>
			Uncover {project.title}
		</Button>
	</div>

	<div
		class="hidden lg:flex lg:bg-gray-900 lg:relative lg:rounded-lg lg:flex-col lg:shrink-0 lg:max-h-[26rem]

                before:z-10 before:absolute before:rounded-t-lg before:top-0 before:w-full before:h-8 before:bg-gradient-to-b before:from-gray-900 before:to-transparent before:pointer-events-none

                after:z-10 after:absolute after:rounded-b-lg after:bottom-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-gray-900 after:to-transparent after:pointer-events-none"
	>
		<div
			class="py-4 px-6 flex flex-col gap-1 overflow-auto scrollbar h-full"
		>
			<h1 class="font-semibold mb-2 text-lg">Developers</h1>

			{#each project.authors as author}
				<Author {author} />
			{/each}
		</div>
	</div>
</div>
