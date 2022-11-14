<script lang="ts">
	export let title: string;
	export let largeGrid = false;
	export let minHeight = false;
</script>

<div class="w-full mx-auto lg:max-w-screen-xl">
	<h1 class="text-2xl font-semibold ml-1">{title}</h1>

	<div
		class:lg:grid={largeGrid}
		class:min-h-120={minHeight}
		class:lg:grid-cols-2={largeGrid}
		class="bg-gray-900 p-4 rounded-lg flex flex-col gap-6 mt-4"
	>
		<slot />
	</div>
</div>
