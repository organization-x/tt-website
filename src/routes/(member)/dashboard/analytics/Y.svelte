<script lang="ts">
	import { getContext } from "svelte";

	// Svelte doesn't have easy typing for context functions in libraries, so ignore
	// @ts-ignore
	const { yScale } = getContext("LayerCake");

	const ticks = $yScale.ticks();

	// Calculate text offset based on how wide the numbers will be
	const textX = Math.trunc(18 + Math.log10(Math.max(...ticks)) * 5);
</script>

{#each ticks as tick}
	<g transform="translate(0, {Math.trunc($yScale(tick))})">
		<line class="stroke-gray-500" x1={textX + 10} x2="100%" />
		<text
			class="text-sm fill-white"
			x={textX}
			text-anchor="end"
			alignment-baseline="middle"
		>
			{tick}
		</text>
	</g>
{/each}
