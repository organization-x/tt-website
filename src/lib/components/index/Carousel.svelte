<script lang="ts">
	import { onMount } from "svelte";

	import CarouselDot from "$lib/components/CarouselDot.svelte";

	let page = 0;
	let scrollable: HTMLDivElement;

	// On a dot click, scroll to the element corresponding to that dot
	const onClick = (i: number) => {
		scrollable.scrollTo({
			left: scrollable.children[0].clientWidth * i,
			behavior: "smooth"
		});
	};

	// Change the current dot based on what item is visible, utilizing the intersection observer
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) => {
					window.innerWidth >= 1024 &&
						entry.isIntersecting &&
						(page = Array.prototype.indexOf.call(
							scrollable.children,
							entry.target
						));
				}),
			{ root: scrollable, threshold: 0.5 }
		);

		Array.from(scrollable.children).forEach((child) =>
			observer.observe(child)
		);

		return () => observer.disconnect();
	});
</script>

<div class="my-10 px-2 lg:hidden">
	<div
		bind:this={scrollable}
		class="flex gap-8 overflow-auto snap-mandatory snap-x scrollbar-hidden max-w-sm mx-auto"
	>
		<slot />
	</div>
	<div class="flex gap-3 mt-6 justify-center lg:hidden">
		{#each { length: scrollable ? Math.round(scrollable.scrollWidth / scrollable.children[0].clientWidth) : 0 } as _, i}
			<CarouselDot active={page === i} on:click={() => onClick(i)} />
		{/each}
	</div>
</div>
