<script lang="ts">
	import CarouselDot from "$lib/components/index/CarouselDot.svelte";
	import { onMount } from "svelte/internal";

	export let amount: number;
	let current = 0;
	let items: HTMLDivElement[] = [];
	let element: HTMLDivElement;

	const onClick = (i: number) => {
		element.scrollTo({
			left: element.children[0].clientWidth * i,
			behavior: "smooth"
		});
	};

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

<div class="mt-10 px-2">
	<div
		bind:this={element}
		class="flex gap-8 overflow-auto snap-mandatory snap-x scrollbar-hidden max-w-sm mx-auto lg:px-20 lg:flex lg:flex-col lg:max-w-screen-xl"
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
