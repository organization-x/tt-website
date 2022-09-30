<script lang="ts">
	import { onMount } from "svelte";

	import CarouselDot from "$lib/components/index/CarouselDot.svelte";

	let current = 0;
	export let amount: number;
	let element: HTMLDivElement;
	let items: HTMLDivElement[] = [];

	// On a dot click, scroll to the element corresponding to that dot
	const onClick = (i: number) => {
		element.scrollTo({
			left: element.children[0].clientWidth * i,
			behavior: "smooth"
		});
	};

	// Change the current dot based on what item is visible, utilizing the intersection observer
	onMount(() => {
		items = Array.from(element.children) as HTMLDivElement[];

		const observer = new IntersectionObserver(
			(e) => {
				if (!e[0].isIntersecting || window.innerWidth >= 1024) return;
				current = items.indexOf(e[0].target as HTMLDivElement);
			},
			{ root: element, threshold: 0.5 }
		);

		items.forEach((item) => observer.observe(item));

		return () => observer.disconnect();
	});
</script>

<div class="my-10 px-2 lg:hidden">
	<div
		bind:this={element}
		class="flex gap-8 overflow-auto snap-mandatory snap-x scrollbar-hidden max-w-sm mx-auto"
	>
		<slot />
	</div>
	<div class="flex gap-3 mt-6 justify-center text-gray-500 lg:hidden">
		{#each { length: amount } as _, i}
			<CarouselDot
				isCurrent={current === i}
				on:click={() => onClick(i)}
			/>
		{/each}
	</div>
</div>

<slot name="alt" />
