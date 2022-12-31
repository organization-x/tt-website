<script lang="ts">
	import { getContext } from "svelte";

	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";

	import type { Writable } from "svelte/store";
	import type { Project } from "@prisma/client";

	export let current: boolean;
	export let projectPair: Project[];

	const timestamp = getContext("timestamp") as string;
	const tabindex = getContext<Writable<number>>("tabindex");
</script>

<button
	on:click
	class:grayscale={!current}
	class:cursor-auto={current}
	class:bg-gray-700={current}
	class:bg-gray-800={!current}
	class="h-14 flex items-center gap-4 justify-center rounded-lg py-4 px-6 snap-center shrink-0"
	tabindex={$tabindex}
	aria-current={current}
>
	<!-- The avatar variant of the images is used here since it's only a very small preview of the banner -->
	<div class="rounded-full w-10 h-10 overflow-hidden">
		<img
			width="512"
			height="512"
			src="{PUBLIC_CLOUDFLARE_URL}/banner-{projectPair[0]
				.id}/avatar?{timestamp}"
			alt="Random shapes and colors in the formation of a hallway"
			loading="lazy"
			class="object-cover object-center bg-gray-400 w-full h-full"
		/>
	</div>

	{#if projectPair.length > 1}
		<div class="rounded-full w-10 h-10 overflow-hidden">
			<img
				width="512"
				height="512"
				src="{PUBLIC_CLOUDFLARE_URL}/banner-{projectPair[1]
					.id}/avatar?{timestamp}"
				alt="Random shapes and colors in the formation of a hallway"
				loading="lazy"
				class="object-cover object-center bg-gray-400 w-full h-full"
			/>
		</div>
	{/if}
</button>
