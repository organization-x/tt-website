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
	<!-- TODO: Replace Cloudflare image delivery URL -->

	<!-- The avatar variant of the images is used here since it's only a very small preview of the banenr -->
	<div class="rounded-full w-10 h-10 overflow-hidden">
		<img
			width="512"
			height="512"
			src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{projectPair[0]
				.id}/avatar"
			alt="Random shapes and colors in the formation of a hallway"
			loading="lazy"
			class="object-cover object-center w-full h-full"
		/>
	</div>

	{#if projectPair.length > 1}
		<div class="rounded-full w-10 h-10 overflow-hidden">
			<img
				width="512"
				height="512"
				src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{projectPair[1]
					.id}/avatar"
				alt="Random shapes and colors in the formation of a hallway"
				loading="lazy"
				class="object-cover object-center w-full h-full"
			/>
		</div>
	{/if}
</button>
