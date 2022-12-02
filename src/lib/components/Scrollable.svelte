<script lang="ts">
	import { onMount } from "svelte";

	import CarouselArrow from "$lib/components/icons/general/CarouselArrow.svelte";

	let className: string;
	export let arrows = false;
	export let innerClass = "";
	export let verticle = false;

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
	const checkScroll = () => {
		if (
			clientWidth ===
			(verticle ? scrollable.scrollHeight : scrollable.scrollWidth)
		)
			disabledSide = Side.Both;
		else if (
			verticle ? scrollable.scrollTop === 0 : scrollable.scrollLeft === 0
		)
			disabledSide = Side.Left;
		else if (
			verticle
				? scrollable.scrollTop -
						(scrollable.scrollHeight - clientWidth) >=
				  -0.5
				: scrollable.scrollLeft -
						(scrollable.scrollWidth - clientWidth) >=
				  -0.5
		)
			disabledSide = Side.Right;
		else disabledSide = Side.None;
	};

	$: clientWidth, scrollable && checkScroll();

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
		// Prevent trackpads from trigeering this since horizontal scrolling is built-in
		if (
			((event.deltaX >= 2 || event.deltaX <= -2) && event.deltaY === 0) ||
			disabledSide === Side.Both
		)
			return;

		// Prevent the page from scrolling
		event.stopPropagation();
		event.preventDefault();

		// The default will be unable to be prevented if it's a top level scroll
		if (!event.defaultPrevented) return;

		scrollable.scrollBy({ left: -event.deltaY });
	};

	// Update the gradients based off of content in them on mount, this is needed
	// for verticle mode only since in horizontal the scroll event fires by itself
	if (verticle)
		onMount(() => {
			// Create an observer to update the gradient on scrollHeight change
			const observer = new MutationObserver(checkScroll);

			observer.observe(scrollable, {
				subtree: true,
				attributes: true
			});

			checkScroll();

			return () => observer.disconnect();
		});
</script>

<!-- When in verticle mode left is considered the top and right bottom -->
{#if verticle}
	<div
		class:before:opacity-0={disabledSide === Side.Left ||
			disabledSide === Side.Both}
		class:after:opacity-0={disabledSide === Side.Right ||
			disabledSide === Side.Both}
		class="
        relative overflow-hidden

        before:transition-opacity before:duration-300 before:z-10 before:absolute before:top-0 before:inset-x-0 before:h-8 before:bg-gradient-to-b before:to-transparent before:pointer-events-none

        after:transition-opacity after:duration-300 after:z-10 after:absolute after:bottom-0 after:inset-x-0 after:h-8 after:bg-gradient-to-b after:from-transparent after:pointer-events-none

        {className}"
	>
		<div
			bind:clientHeight={clientWidth}
			bind:this={scrollable}
			on:scroll={checkScroll}
			class="flex flex-col gap-4 overflow-auto scrollbar-hidden h-full {innerClass}"
		>
			<slot />
		</div>
	</div>
{:else if arrows}
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
				on:scroll={checkScroll}
				class="flex gap-5 w-full overflow-auto py-2 scrollbar-hidden snap-x snap-proximity {innerClass}"
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
			on:scroll={checkScroll}
			on:wheel|nonpassive={onWheel}
			class="flex gap-5 overflow-auto py-2 scrollbar-hidden {innerClass}"
		>
			<slot />
		</div>
	</div>
{/if}
