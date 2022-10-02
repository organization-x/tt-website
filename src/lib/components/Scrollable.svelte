<script lang="ts">
	import CarouselArrow from "$lib/components/icons/CarouselArrow.svelte";

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

	let innerWidth: number;
	let disabledSide = Side.Left;
	let scrollable: HTMLDivElement;

	// Update which gradient on either side is shown based on where the element is scrolled to
	const onScroll = () => {
		if (scrollable.scrollLeft === 0) {
			disabledSide = Side.Left;
		} else if (
			scrollable.scrollLeft -
				(scrollable.scrollWidth - scrollable.clientWidth) >=
			-0.5
		) {
			disabledSide = Side.Right;
		} else {
			disabledSide = Side.None;
		}
	};

	const checkArrows = () => {
		// Set a timeout since clientWidth and scrollWidth don't seem to get the correct inf0
		if (scrollable) {
			scrollable.clientWidth === scrollable.scrollWidth
				? (disabledSide = Side.Both)
				: onScroll();
		}
	};

	$: innerWidth, checkArrows();

	// TODO: Fix arrows enabling/disabling on slot contents change

	// Scroll on arrow click
	const scroller = (side: Side) => {
		scrollable.scrollTo({
			left:
				side === Side.Left
					? scrollable.scrollLeft - scrollable.children[0].clientWidth
					: scrollable.scrollLeft +
					  scrollable.children[0].clientWidth,
			behavior: "smooth"
		});
	};
</script>

<svelte:window bind:innerWidth />

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
				bind:this={scrollable}
				on:scroll={onScroll}
				class="
                flex gap-6 overflow-auto py-2 scrollbar-hidden snap-x snap-proximity"
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
			bind:this={scrollable}
			on:scroll={onScroll}
			class="
            flex gap-6 overflow-auto py-2 scrollbar-hidden"
		>
			<slot />
		</div>
	</div>
{/if}
