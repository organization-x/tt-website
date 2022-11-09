<script lang="ts">
	import Arrow from "$lib/components/icons/general/Arrow.svelte";

	let className = "";
	export let label: string;
	export let current: number;
	export let previous: number;

	export { className as class };

	// If the previous views are 0 then set it to 100% higher or if the are the same as the current set it to even
	const percent =
		previous === current
			? 1
			: previous
			? Math.trunc(current / previous)
			: 2;

	const color = percent > 1 ? "text-green-light" : "text-red-light";
</script>

<div class="mt-6 lg:mt-auto {className}">
	<h1 class=" mb-2">
		{#if percent === 1}
			No Change
		{:else}
			<!-- Thes ternary operations are for formatting if the number is 100% down from previous, in which case prevPercent is -->
			<!-- 0, or if prevPercent comes out to be above 1000% where then it is capped at 999% -->
			Now
			<span class={color}>
				{percent > 1
					? `${
							percent >= 10
								? 999
								: Math.trunc((percent - 1) * 100)
					  }% higher`
					: `${percent ? Math.trunc(percent * 100) : 100}% lower`}
			</span>
			than before
		{/if}
	</h1>

	<div class="flex gap-3 justify-center items-center text-sm">
		<h1 class="font-normal">
			{previous}
			{label}
		</h1>
		{#if percent === 1}
			<div class="bg-gray-500 h-1 w-5 rounded-full" />
		{:else}
			<Arrow class="w-5 h-5 {color}" />
		{/if}
		<h1 class="font-normal">
			{current}
			{label}
		</h1>
	</div>
</div>
