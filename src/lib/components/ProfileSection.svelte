<script lang="ts">
	export let title: string;
	export let largeGrid = false;
	export let minHeight = false;
</script>

<div class="flex flex-col gap-4 w-full mx-auto lg:max-w-screen-xl">
	<h1 class="text-2xl font-semibold ml-1">{title}</h1>
	<div
		class:lg:grid={largeGrid}
		class:min-h-[30rem]={minHeight}
		class:lg:grid-cols-2={largeGrid}
		class="bg-gray-500/40 p-4 rounded-lg flex flex-col gap-6"
	>
		<slot />
	</div>
</div>
