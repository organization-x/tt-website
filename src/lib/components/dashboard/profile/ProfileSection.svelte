<script lang="ts">
	export let title: string;
	export let direction: string;
	export let largeGrid = false;
</script>

<div class="flex flex-col gap-4 w-full max-w-xl mx-auto lg:max-w-screen-xl">
	<h1 class="text-2xl font-semibold ml-1">{title}</h1>
	<div
		class:lg:grid={largeGrid}
		class:lg:grid-cols-2={largeGrid}
		class="bg-gray-500/40 p-4 rounded-lg relative flex flex-col gap-6"
	>
		<div
			class="from-transparent to-gray-500 bg-panel w-full h-full absolute inset-0 opacity-30 -z-10 {direction}"
		/>
		<slot />
	</div>
</div>
