<script lang="ts">
	import { quadOut } from "svelte/easing";
	import { tweened } from "svelte/motion";

	let className: string;
	export let name: string;
	export let progress: number;
	export let playing: boolean;

	progress = Math.floor(progress * 100);

	const percent = tweened(progress >= 100 ? 100 : 0, {
		duration: 500,
		easing: quadOut
	});

	$: if (playing) $percent = progress;

	export { className as class };
</script>

<div class="bg-gray-700 rounded-lg overflow-hidden">
	<div class="flex gap-6 items-center px-5 py-6">
		<div class:grayscale={progress < 100} class="w-12 h-12 shrink-0">
			<slot name="badge" />
		</div>

		<div>
			<h1 class="font-semibold text-xl">{name}</h1>

			<p class="text-sm">
				<slot />
			</p>
		</div>
	</div>

	{#if progress >= 100}
		<div class="w-full h-2 {className}" />
	{:else}
		<div class="w-full h-2 bg-gray-500">
			<div class="h-full bg-gray-400" style="width: {$percent}%;" />
		</div>
	{/if}
</div>
