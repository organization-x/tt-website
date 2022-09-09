<script lang="ts">
	export let title: string;
	export let direction: string;
</script>

<div class="flex flex-col gap-4 w-full">
	<h1 class="text-2xl font-semibold ml-1">{title}</h1>
	<div class="bg-gray-500/40 p-4 rounded-lg relative flex flex-col gap-4">
		<div
			class="from-transparent to-gray-500 bg-panel w-full h-full absolute inset-0 opacity-30 {direction} -z-10"
		/>
		<slot />
	</div>
</div>
