<script lang="ts">
	import { onMount } from "svelte";

	import CarouselDot from "$lib/components/CarouselDot.svelte";

	let page = 0;
	let className: string;
	let innerWidth: number;
	let scrollable: HTMLDivElement;

	export { className as class };

	// On a dot click, scroll to the element corresponding to that dot
	const onClick = (i: number) => {
		scrollable.scrollTo({
			left: scrollable.children[0].clientWidth * i,
			behavior: "smooth"
		});
	};

	// Change the current dot based on what item is visible, utilizing the intersection observer
	onMount(() => {
		innerWidth = window.innerWidth;

		const observer = new IntersectionObserver(
			(entries) =>
				innerWidth < 1024 &&
				entries.forEach((entry) => {
					entry.isIntersecting &&
						(page = Array.prototype.indexOf.call(
							scrollable.children,
							entry.target
						));
				}),
			{ root: scrollable, threshold: 0.5 }
		);

		for (const child of scrollable.children) {
			observer.observe(child);
		}

		return () => observer.disconnect();
	});
</script>

<svelte:window
	on:resize={() =>
		setTimeout(
			() =>
				(innerWidth = window.innerWidth) &&
				window.innerWidth >= 1024 &&
				page &&
				(page = 0)
		)}
/>

<div class="my-10 px-2">
	<div
		bind:this={scrollable}
		class="flex gap-8 overflow-auto snap-mandatory snap-x scrollbar-hidden max-w-sm mx-auto md:max-w-md lg:snap-none {className}"
	>
		<slot />
	</div>

	<div class="flex gap-3 mt-6 justify-center lg:hidden">
		{#each { length: 3 } as _, i}
			<CarouselDot active={page === i} on:click={() => onClick(i)} />
		{/each}
	</div>
</div>
