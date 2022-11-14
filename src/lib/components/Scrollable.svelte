<script lang="ts">
	import CarouselArrow from "$lib/components/icons/general/CarouselArrow.svelte";

	let className: string;
	export let arrows = false;

	export { className as class };

	// Keep track of gradients for disabling them
	const enum Side {
		Left,
		Right,
		Both,
		None
	}

	let clientWidth: number;
	let disabledSide = Side.Left;
	let scrollable: HTMLDivElement;

	// Update which gradient and arrows on either side is shown based on where the element is scrolled to
	const checkArrows = () => {
		if (clientWidth === scrollable.scrollWidth) disabledSide = Side.Both;
		else if (scrollable.scrollLeft === 0) disabledSide = Side.Left;
		else if (
			scrollable.scrollLeft - (scrollable.scrollWidth - clientWidth) >=
			-0.5
		)
			disabledSide = Side.Right;
		else disabledSide = Side.None;
	};

	$: clientWidth, scrollable && checkArrows();

	// Scroll on arrow click
	const scroller = (side: Side) =>
		scrollable.scrollTo({
			left:
				side === Side.Left
					? scrollable.scrollLeft - scrollable.children[0].clientWidth
					: scrollable.scrollLeft +
					  scrollable.children[0].clientWidth,
			behavior: "smooth"
		});

	// Verticle scroll without holding shift for desktop
	const onWheel = (event: WheelEvent) => {
		if (
			Math.abs(event.deltaX) > 2 ||
			Math.abs(event.deltaY) < 10 ||
			disabledSide === Side.Both
		)
			return;

		// Prevent the page from scrolling
		event.preventDefault();

		// The default will be unable to be prevented if it's a top level scroll
		if (!event.defaultPrevented) return;

		scrollable.scrollBy({
			left: -event.deltaY,
			behavior: "smooth"
		});
	};
</script>

{#if arrows}
	<div class:justify-center={disabledSide === Side.Both} class="flex gap-4">
		<CarouselArrow
			on:click={() => scroller(Side.Left)}
			disabled={disabledSide === Side.Left}
			hidden={disabledSide === Side.Both}
		/>

		<div
			class:before:opacity-0={disabledSide === Side.Left ||
				disabledSide === Side.Both}
			class:after:opacity-0={disabledSide === Side.Right ||
				disabledSide === Side.Both}
			class="
            relative overflow-hidden

            before:transition-opacity before:duration-300 before:z-10 before:absolute before:top-0 before:left-0 before:w-8 before:h-full before:bg-gradient-to-r before:to-transparent before:pointer-events-none

            after:transition-opacity after:duration-300 after:z-10 after:absolute after:top-0 after:right-0 after:w-8 after:h-full after:bg-gradient-to-r after:from-transparent after:pointer-events-none

            {className}"
		>
			<div
				bind:clientWidth
				bind:this={scrollable}
				on:scroll={checkArrows}
				on:wheel|nonpassive={onWheel}
				class="flex gap-5 w-full overflow-auto py-2 scrollbar-hidden snap-x snap-proximity"
			>
				<slot />
			</div>
		</div>

		<CarouselArrow
			on:click={() => scroller(Side.Right)}
			disabled={disabledSide === Side.Right}
			hidden={disabledSide === Side.Both}
			class="rotate-180"
		/>
	</div>
{:else}
	<div
		class:before:opacity-0={disabledSide === Side.Left ||
			disabledSide === Side.Both}
		class:after:opacity-0={disabledSide === Side.Right ||
			disabledSide === Side.Both}
		class="
        relative overflow-hidden

        before:transition-opacity before:duration-300 before:z-10 before:absolute before:top-0 before:left-0 before:w-8 before:h-full before:bg-gradient-to-r before:to-transparent before:pointer-events-none

        after:transition-opacity after:duration-300 after:z-10 after:absolute after:top-0 after:right-0 after:w-8 after:h-full after:bg-gradient-to-r after:from-transparent after:pointer-events-none

        {className}"
	>
		<div
			bind:clientWidth
			bind:this={scrollable}
			on:scroll={checkArrows}
			on:wheel={onWheel}
			class="flex gap-5 overflow-auto py-2 scrollbar-hidden snap-x snap-proximity"
		>
			<slot />
		</div>
	</div>
{/if}
