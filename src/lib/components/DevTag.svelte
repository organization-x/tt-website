<script lang="ts">
	import { getIcon } from "$lib/getIcon";

	export let name: string;
	export let lightBg = true;
</script>

{#if name}
	<div
		class:bg-gray-500={lightBg}
		class:bg-gray-700={!lightBg}
		class="flex justify-center items-center font-semibold rounded-lg gap-3 px-4 py-5 last:odd:col-span-2"
	>
		<svelte:component this={getIcon(name)} class="w-6 h-6 shrink-0" />
		<h1 class="text-sm">{name.replaceAll("_", " ")}</h1>
	</div>
{:else}
	<div
		class:border-gray-500={lightBg}
		class:border-gray-700={!lightBg}
		class="rounded-lg border-4 border-dashed h-16 last:odd:col-span-2"
	/>
{/if}
