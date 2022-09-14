<script lang="ts">
	import { onMount } from "svelte";

	import CarouselArrow from "./icons/CarouselArrow.svelte";

	let className: string;
	let element: HTMLDivElement;

	export { className as class };

	const enum disabledState {
		None,
		Left,
		Right,
		Both
	}

	// 0 = none, 1 = left, 2 = right, 3 = both
	let disabledArrows = disabledState.Left;

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
			disabledArrows = disabledState.Left;
		} else if (
			element.scrollLeft - (element.scrollWidth - element.clientWidth) >=
			-0.5
		) {
			disabledArrows = disabledState.Right;
		} else {
			disabledArrows = disabledState.None;
		}
	};

	// Hide arrows when the content of the scrollable area is smaller than the scrollrow itself
	onMount(() => {
		const onResize = () => {
			element.clientWidth === element.scrollWidth
				? (disabledArrows = disabledState.Both)
				: onScroll();
		};

		addEventListener("resize", onResize, { passive: true });

		if (element.clientWidth === element.scrollWidth)
			disabledArrows = disabledState.Both;

		return () => removeEventListener("resize", onResize);
	});
</script>

<div class="flex gap-4 h-14 {className}">
	<CarouselArrow
		on:click={() => scroller(true)}
		disabled={disabledArrows === disabledState.Left}
		hidden={disabledArrows === disabledState.Both}
	/>
	<div
		class="relative overflow-hidden w-full

            before:z-10 before:absolute before:top-0 before:left-0 before:w-8 before:h-full before:bg-gradient-to-r before:from-gray-900 before:to-transparent before:pointer-events-none

            after:z-10 after:absolute after:top-0 after:right-0 after:w-8 after:h-full after:bg-gradient-to-r after:from-transparent after:to-gray-900 after:pointer-events-none"
	>
		<div
			on:scroll={onScroll}
			bind:this={element}
			class:justify-center={disabledArrows === disabledState.Both}
			class="flex gap-6 overflow-auto scrollbar-hidden px-6 snap-x snap-proximity"
		>
			<slot />
		</div>
	</div>
	<CarouselArrow
		on:click={() => scroller(false)}
		disabled={disabledArrows === disabledState.Right}
		hidden={disabledArrows === disabledState.Both}
		class="rotate-180"
	/>
</div>
