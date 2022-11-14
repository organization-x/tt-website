<script lang="ts">
	import { onMount } from "svelte";
	import { scaleBand } from "d3-scale";
	import { tweened } from "svelte/motion";
	import { quadInOut } from "svelte/easing";
	import { LayerCake, Svg } from "layercake";

	import Y from "$lib/components/dashboard/analytics/Y.svelte";
	import CarouselDot from "$lib/components/CarouselDot.svelte";
	import Column from "$lib/components/dashboard/analytics/Column.svelte";
	import DataKey from "$lib/components/dashboard/analytics/DataKey.svelte";

	export let title: string;
	export let data: App.GraphData[];
	export let domain: number[] = [
		0,
		data.length
			? (Math.round(Math.max(...data.map((item) => item.value)) / 50) +
					1) *
			  50
			: 50
	];

	let page = 0;
	let innerWidth: number;
	let parent: HTMLDivElement;
	let scrollable: HTMLDivElement;

	// Create scale up here so it's not being recreated for each component
	const xScale = scaleBand().paddingInner(0.3).paddingOuter(0.5).round(true);

	// Created the paginated data
	const pages = Array.from({ length: Math.ceil(data.length / 5) }, (_, i) =>
		data.slice(i * 5, i * 5 + 5)
	);

	const halfPages = Math.round(pages.length / 2);

	// Rising animation when the graph comes into view
	const rise = tweened(0, {
		duration: 800,
		easing: quadInOut
	});

	onMount(() => {
		innerWidth = window.innerWidth;

		// Only play the column rising animation once the graph has come into view
		const animObserver: IntersectionObserver = new IntersectionObserver(
			(entries) =>
				entries[0].isIntersecting &&
				($rise = 1) &&
				animObserver.disconnect(),
			{ threshold: [0.3] }
		);

		animObserver.observe(parent);

		if (!data.length) return () => animObserver.disconnect();

		// Update carousel dots when the user scrolls
		const scrollObserver = new IntersectionObserver(
			(entries) =>
				entries.forEach(
					(entry) =>
						innerWidth < 1024 &&
						entry.isIntersecting &&
						(page = Array.prototype.indexOf.call(
							scrollable.children,
							entry.target
						))
				),
			{ threshold: [0.7], root: scrollable }
		);

		Array.from(scrollable.children).forEach((child) =>
			scrollObserver.observe(child)
		);

		return () => {
			animObserver.disconnect();
			scrollObserver.disconnect();
		};
	});
</script>

<!-- setTimeout hack since innerWidth loves to be innacurate randomly -->
<svelte:window
	on:resize={() => {
		if (!data.length) return;

		setTimeout(() => {
			innerWidth = window.innerWidth;

			window.innerWidth >= 1024
				? page > halfPages && (page = halfPages - 1)
				: scrollable.clientWidth * page < scrollable.scrollLeft &&
				  scrollable.scrollTo({
						left: scrollable.clientWidth * page
				  });
		});
	}}
/>

<div
	bind:this={parent}
	class="flex flex-col min-h-112 max-w-sm mx-auto lg:max-w-none"
>
	<h1 class="text-lg font-semibold mb-6">
		{title}
	</h1>

	{#if data.length}
		<div class="relative h-72 mb-8">
			{#each pages as data, i}
				{#if page === i}
					<div class="absolute inset-0 select-none">
						<LayerCake
							x="label"
							y="value"
							{xScale}
							yDomain={domain}
							data={innerWidth >= 1024
								? pages[i * 2 + 1]
									? data.concat(pages[i * 2 + 1])
									: data
								: data}
							padding={{ bottom: 10, top: 10 }}
							custom={{ rise: $rise }}
						>
							<Svg>
								<Y />
								<Column />
							</Svg>
						</LayerCake>
					</div>
				{/if}
			{/each}
		</div>

		<div
			bind:this={scrollable}
			class="flex gap-4 snap-mandatory snap-x overflow-auto scrollbar-hidden mb-4 lg:bg-gray-700 lg:py-6 lg:rounded-lg lg:mb-0 lg:overflow-hidden lg:min-h-120"
		>
			{#each pages as data, i}
				<div
					class:lg:flex={i === page * 2 || i === page * 2 + 1}
					class:lg:hidden={i !== page * 2 && i !== page * 2 + 1}
					class="flex flex-col gap-2 w-full shrink-0 snap-center lg:w-1/2 lg:gap-4"
				>
					{#each data as item}
						<DataKey
							label={item.label}
							className={item.color}
							value={item.value}
						/>
					{/each}
				</div>
			{/each}
		</div>

		{#if pages.length > 1}
			<div class="flex justify-center gap-2 lg:hidden">
				{#each pages as _, i}
					<CarouselDot
						active={page === i}
						on:click={() =>
							scrollable.scrollTo({
								left: scrollable.clientWidth * page,
								behavior: "smooth"
							})}
					/>
				{/each}
			</div>

			<div class="hidden lg:flex lg:gap-4 lg:justify-center">
				{#each { length: halfPages } as _, i}
					<button
						on:click={() => (page = i)}
						class:cursor-auto={page === i}
						class="rounded-b-lg w-20 p-2 {page === i
							? 'bg-gray-700'
							: 'bg-gray-700/60'}"
					>
						{i + 1}
					</button>
				{/each}
			</div>
		{/if}
	{:else}
		<h1 class="font-semibold text-xl my-auto">No Data</h1>
	{/if}
</div>
