<script lang="ts">
	import type { Project } from "@prisma/client";

	export let current: boolean;
	export let projectPair: Project[];
</script>

<button
	on:click
	class:grayscale={!current}
	class="h-14 flex items-center gap-4 justify-center bg-gray-500/40 rounded-lg py-4 px-6 snap-center shrink-0"
>
	<!-- TODO: Replace placeholders -->

	<div class="rounded-full w-10 h-10 overflow-hidden">
		<img
			width="200"
			height="200"
			src="/assets/projects/project/placeholder/banner.webp"
			alt="Random shapes and colors in the formation of a hallway"
			loading="lazy"
			class="object-cover object-center w-full h-full"
		/>
	</div>

	{#if projectPair.length > 1}
		<div class="rounded-full w-10 h-10 overflow-hidden">
			<img
				width="200"
				height="200"
				src="/assets/projects/project/placeholder/banner.webp"
				alt="Random shapes and colors in the formation of a hallway"
				loading="lazy"
				class="object-cover object-center w-full h-full"
			/>
		</div>
	{/if}
</button>
