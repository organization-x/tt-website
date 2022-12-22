<script lang="ts">
	import { getIcon } from "$lib/getIcon";
	import Button from "$lib/components/Button.svelte";
	import Author from "$lib/components/Author.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";

	export let project: App.ProjectWithMetadata;
	export let trackClick: (name: string) => void;
</script>

<div
	class="mt-20 lg:mt-32 lg:grid lg:project-cols lg:gap-x-8 lg:[&:nth-child(even)>:first-child]:order-1"
>
	<div
		class="bg-gray-900 p-4 h-[39.2rem] rounded-lg relative mx-auto max-w-xl w-full flex flex-col lg:px-8 lg:h-[26rem]"
	>
		<slot name="svg" />

		<h1 class="text-3xl font-semibold text-center mt-10">
			{project.title}
		</h1>

		<p class="mt-6 text-center max-w-sm mx-auto lg:text-base">
			{project.description}
		</p>

		<div class="flex gap-2 items-center justify-center mt-auto mb-6">
			{#each project.skills as skill}
				<svelte:component this={getIcon(skill)} class="w-8 h-8" />
			{/each}
		</div>

		<Scrollable
			class="before:from-gray-900 after:to-gray-900 w-full mx-auto lg:hidden"
		>
			{#each project.authors as author}
				<Author {author} />
			{/each}
		</Scrollable>

		<Button
			on:click={() =>
				trackClick(`project_${project.url.replaceAll("-", "_")}`)}
			href="/projects/{project.url}"
			class="w-full mt-6 bg-gray-800/100 text-white py-4 lg:mt-0"
		>
			Uncover {project.title}
		</Button>
	</div>

	<Scrollable
		vertical={true}
		class="hidden before:from-gray-900 after:to-gray-900 lg:block lg:bg-gray-900 lg:rounded-lg lg:shrink-0 lg:max-h-[26rem] lg:px-4"
		innerClass="lg:gap-3 lg:scrollbar-hidden"
	>
		<h1 class="font-semibold mt-4 text-lg">Developers</h1>

		{#each project.authors as author}
			<Author {author} />
		{/each}
	</Scrollable>
</div>
