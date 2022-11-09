<script lang="ts">
	import { getIcon } from "$lib/getIcon";
	import Button from "$lib/components/Button.svelte";
	import Author from "$lib/components/Author.svelte";

	export let project: App.ProjectWithMetadata;
</script>

<div class="mt-20 lg:mt-32 lg:flex lg:gap-8 lg:even:flex-row-reverse">
	<div
		class="bg-gray-500/40 p-4 rounded-xl relative mx-auto max-w-lg lg:max-w-2xl lg:w-3/5 lg:h-100"
	>
		<slot name="svg" />

		<h1
			class="text-2xl sm:text-2xl md:text-3xl font-semibold text-center mt-10"
		>
			{project.title}
		</h1>

		<p class="mt-6 text-center lg:text-base">
			{project.description}
		</p>

		<Button href={project.url} class="mt-6 mx-auto lg:mt-10">
			Uncover {project.title}
		</Button>

		<div class="flex gap-2 items-center justify-center my-8 lg:mt-8">
			{#each project.skills as skill}
				<svelte:component this={getIcon(skill)} class="w-8 h-8" />
			{/each}
		</div>

		<div
			class="bg-gray-800 rounded-lg drop-shadow-lg relative mx-auto max-w-md lg:hidden

            before:z-10 before:absolute before:rounded-lg before:top-0 before:left-0 before:w-8 before:h-full before:bg-gradient-to-r before:from-gray-800 before:to-transparent before:pointer-events-none

            after:z-10 after:absolute after:rounded-lg after:top-0 after:right-0 after:w-8 after:h-full after:bg-gradient-to-r after:from-transparent after:to-gray-800 after:pointer-events-none"
		>
			<div
				class="flex overflow-auto py-2 px-8 gap-8 snap-x snap-proximity rounded-lg scrollbar-hidden"
			>
				{#each project.authors as author}
					<Author {author} />
				{/each}
			</div>
		</div>
	</div>

	<div
		class="hidden bg-gray-500/40 relative rounded-xl h-min lg:flex lg:flex-col lg:shrink-0 lg:w-1/3 lg:h-100

            before:z-10 before:absolute before:rounded-t-xl before:top-0 before:w-full before:h-8 before:bg-gradient-to-b before:from-gray-900 before:to-transparent before:pointer-events-none

            after:z-10 after:absolute after:rounded-b-xl after:bottom-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-gray-900 after:to-transparent after:pointer-events-none"
	>
		<div class="py-4 px-6 flex flex-col gap-1 overflow-auto scrollbar">
			<h1 class="font-semibold mb-2">Developers</h1>
			{#each project.authors as author}
				<Author {author} />
			{/each}
		</div>
	</div>
</div>
