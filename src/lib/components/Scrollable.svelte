<script lang="ts">
	let className = "";

	export { className as class };

	// Keep track of gradients for disabling them
	const enum Gradient {
		Left,
		Right,
		None
	}

	let disabledGradient = Gradient.Left;

	// Update which gradient on either side is shown based on where the element is scrolled to
	const onScroll = (e: Event) => {
		const target = e.target as HTMLDivElement;

		if (target.scrollLeft === 0) {
			disabledGradient = Gradient.Left;
		} else if (
			target.scrollLeft - (target.scrollWidth - target.clientWidth) >=
			-0.5
		) {
			disabledGradient = Gradient.Right;
		} else {
			disabledGradient = Gradient.None;
		}
	};
</script>

<div
	class:before:opacity-0={disabledGradient === Gradient.Left}
	class:after:opacity-0={disabledGradient === Gradient.Right}
	class="
        relative

        before:transition-opacity before:duration-300 before:z-10 before:absolute before:top-0 before:left-0 before:w-8 before:h-full before:bg-gradient-to-r before:to-transparent before:pointer-events-none

        after:transition-opacity after:duration-300 after:z-10 after:absolute after:top-0 after:right-0 after:w-8 after:h-full after:bg-gradient-to-r after:from-transparent after:pointer-events-none

        {className}"
>
	<div
		on:scroll={onScroll}
		class="
            flex gap-4 overflow-auto py-2 scrollbar-hidden"
	>
		<slot />
	</div>
</div>
