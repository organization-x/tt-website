<script lang="ts">
	import { onMount } from "svelte/internal";

	import CarouselArrow from "./icons/CarouselArrow.svelte";

	let element: HTMLDivElement;
	let className: string;

	export { className as class };

	// 0 = none, 1 = left, 2 = right, 3 = both
	let disabledArrows = 1;

	// Scroll on arrow click
	const scroller = (left: boolean) => {
		element.scrollTo({
			left: left
				? element.scrollLeft - element.children[0].clientWidth
				: element.scrollLeft + element.children[0].clientWidth,
			behavior: "smooth"
		});
	};

	// Change disabeld arrows based on scroll position
	const onScroll = () => {
		if (element.scrollLeft === 0) {
			disabledArrows = 1;
		} else if (
			element.scrollLeft - (element.scrollWidth - element.clientWidth) >=
			-0.5
		) {
			disabledArrows = 2;
		} else {
			disabledArrows = 0;
		}
	};

	// Hide arrows when the content of the scrollable area is smaller than the scrollrow itself
	onMount(() => {
		const onResize = () => {
			element.clientWidth === element.scrollWidth
				? (disabledArrows = 3)
				: onScroll();
		};

		addEventListener("resize", onResize, { passive: true });

		if (element.clientWidth === element.scrollWidth) disabledArrows = 3;

		return () => removeEventListener("resize", onResize);
	});
</script>

<div class="flex gap-4 h-14 {className}">
	<CarouselArrow
		on:click={() => scroller(true)}
		disabled={disabledArrows === 1}
		hidden={disabledArrows === 3}
	/>
	<div
		class="relative overflow-hidden w-full

            before:z-10 before:absolute before:top-0 before:left-0 before:w-8 before:h-full before:bg-gradient-to-r before:from-gray-900 before:to-transparent before:pointer-events-none

            after:z-10 after:absolute after:top-0 after:right-0 after:w-8 after:h-full after:bg-gradient-to-r after:from-transparent after:to-gray-900 after:pointer-events-none"
	>
		<div
			on:scroll={onScroll}
			bind:this={element}
			class:justify-center={disabledArrows === 3}
			class="flex gap-6 overflow-auto scrollbar-hidden px-6 snap-x snap-proximity"
		>
			<slot />
		</div>
	</div>
	<CarouselArrow
		on:click={() => scroller(false)}
		disabled={disabledArrows === 2}
		hidden={disabledArrows === 3}
		class="rotate-180"
	/>
</div>
