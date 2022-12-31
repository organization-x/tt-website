<script lang="ts">
	import { getContext } from "svelte";

	import type { Writable } from "svelte/store";

	// Svelte doesn't have easy typing for context functions in libraries, so ignore
	// @ts-ignore
	const { data, xGet, yGet, yRange, xScale, height, y, custom } = getContext<{
		data: Writable<App.GraphData[]>;
		custom: Writable<{ rise: number }>;
	}>("LayerCake");
</script>

{#each $data as item (item.label)}
	{@const colHeight = Math.abs(
		$custom.rise * ($yRange[0] - $yGet(item)) - 3.5
	)}
	{@const colWidth = $xScale.bandwidth() - 5}

	<g transform="translate({$xGet(item) + 14}, 0)">
		<path
			d="m 0 {$height + 0.3}
                    v -{colHeight}
                    q 0 -5 5 -5
                    h {colWidth}
                    q 5 0 5 5 v
                    {colHeight}
                    z"
			class="fill-current {item.color}"
		/>

		<!-- The reason 9 is added here is because of the -5 earlier and because the text has weird spacing -->
		<text
			x={(colWidth + 9) / 2}
			y={$height - colHeight - 10}
			class="fill-white"
			text-anchor="middle"
		>
			{$y(item)}
		</text>
	</g>
{/each}
