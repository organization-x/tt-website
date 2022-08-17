<script lang="ts">
	import CarouselDot from "$lib/components/icons/CarouselDot.svelte";
</script>

<!-- TODO: Make dots actually change on scroll, Add automatic scrolling, for lg screens maybe add effect for cards that are only slightly visible -->

<div class="mt-10 px-2">
	<div
		class="flex gap-8 overflow-auto snap-mandatory snap-x scrollbar-hidden max-w-sm mx-auto lg:max-w-2xl lg:px-32 xl:px-20 xl:flex xl:flex-col xl:max-w-screen-xl"
	>
		<slot />
	</div>
	<div class="flex gap-3 mt-6 justify-center xl:hidden">
		<CarouselDot class="text-white w-2 h-2" />
		<CarouselDot class="text-gray-500 w-2 h-2" />
		<CarouselDot class="text-gray-500 w-2 h-2" />
	</div>
</div>
