<script lang="ts">
	import type { Project } from "@prisma/client";

	export let current: boolean;
	export let projectPair: Project[];
</script>

<div
	on:click
	class:grayscale={!current}
	class:cursor-pointer={!current}
	class="h-14 flex items-center gap-4 justify-center bg-gray-500/40 rounded-lg py-4 px-6 snap-center shrink-0"
>
	<img
		src="/projects/project/{projectPair[0].url}/banner.webp"
		alt="Random shapes and colors in the formation of a hallway"
		loading="lazy"
		class="rounded-full w-10"
	/>
	<img
		src="/projects/project/{projectPair[1].url}/banner.webp"
		alt="Random shapes and colors in the formation of a hallway"
		loading="lazy"
		class="rounded-full w-10"
	/>
</div>
