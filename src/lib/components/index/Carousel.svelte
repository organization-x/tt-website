<script lang="ts">
	import Dot from "$lib/components/icons/Dot.svelte";

	let current = 1;

	const onScroll = ({ target }: Event) => {
		const { scrollWidth, scrollLeft, children } = target as HTMLDivElement;

		if (scrollLeft < scrollWidth - children[0].clientWidth * 3) {
			current = 1;
		} else if (scrollLeft < scrollWidth - children[0].clientWidth * 2) {
			current = 2;
		} else {
			current = 3;
		}
	};
</script>

<div class="mt-10 px-2">
	<div
		on:scroll={onScroll}
		class="flex gap-8 overflow-auto snap-mandatory snap-x scrollbar-hidden max-w-sm mx-auto lg:px-20 lg:flex lg:flex-col lg:max-w-screen-xl"
	>
		<slot />
	</div>
	<div class="flex gap-3 mt-6 justify-center text-gray-500 lg:hidden">
		<Dot
			class="w-2 h-2 transition-colors
            {current === 1 ? 'text-white' : ''}"
		/>
		<Dot
			class="w-2 h-2 transition-colors
        {current === 2 ? 'text-white' : ''}"
		/>
		<Dot
			class="w-2 h-2 transition-colors
        {current === 3 ? 'text-white' : ''}"
		/>
	</div>
</div>
