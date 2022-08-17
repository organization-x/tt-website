<script lang="ts">
	import type { Developer, Image } from "../types";

	import Button from "../Button.svelte";
	import ProjectDev from "./ProjectDev.svelte";

	export let side = "left";
	export let title: string;
	export let href: string;
	export let developers: Developer[];
	export let img: Image;
	export let imgClass: string;
</script>

<div
	class="bg-gray-500/40 mt-20 lg:mt-28 p-4 rounded-xl relative mx-auto max-w-lg lg:max-w-2xl
    {side === 'left' ? 'lg:flex-row' : 'flex-row-reverse'}"
>
	<!-- svelte-ignore a11y-missing-attribute -->
	<!-- Svelte doesnt recognize alt attribute being provided in spread -->
	<img
		class="absolute -top-12 right-0 left-0 mx-auto lg:-top-16 {imgClass}"
		loading="lazy"
		{...img}
	/>
	<h1
		class="text-2xl sm:text-2xl md:text-3xl font-semibold text-center mt-10"
	>
		{title}
	</h1>
	<p class="mt-6 text-center lg:text-base">
		<slot />
	</p>
	<Button {href} class="mt-6 mx-auto">Learn More</Button>
	<div
		class="bg-gray-700 rounded-lg drop-shadow-lg mt-6 relative mx-auto max-w-md"
	>
		<div
			class="flex overflow-auto py-2 px-8 gap-8 snap-x snap-proximity scrollbar-hidden rounded-lg"
		>
			{#each developers as developer}
				<ProjectDev info={developer} />
			{/each}
		</div>
		<div
			class="absolute rounded-lg top-0 left-0 w-8 h-full bg-gradient-to-r from-gray-700 to-transparent pointer-events-none"
		/>
		<div
			class="absolute rounded-lg top-0 right-0 w-8 h-full bg-gradient-to-r from-transparent to-gray-700 pointer-events-none"
		/>
	</div>
</div>
