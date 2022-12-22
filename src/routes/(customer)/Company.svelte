<script lang="ts">
	import { getIcon } from "$lib/getIcon";

	import type { TechSkill } from "@prisma/client";

	export let skills: TechSkill[];
	export let image: {
		src: string;
		alt: string;
		width: number;
		height: number;
	};

	const { src, alt, width, height } = image;
</script>

<div
	class="bg-gray-800 p-4 rounded-lg flex flex-col max-w-lg mx-auto even:text-right even:items-end lg:transition-[filter,transform] lg:hover:-translate-y-2 lg:hover:drop-shadow-lg"
>
	<img class="w-48" loading="lazy" {src} {alt} {width} {height} />

	<p class="my-4">
		<slot />
	</p>

	<div class="flex gap-4 items-center mt-2 lg:mt-auto">
		{#each skills as skill}
			<svelte:component this={getIcon(skill)} class="w-7 h-7" />
		{/each}
	</div>
</div>
