<script lang="ts">
	import { getIcon } from "$lib/getIcon";

	export let name: string;
</script>

{#if name}
	<div
		class="flex justify-center items-center font-semibold bg-gray-800 rounded-lg gap-3 p-4"
	>
		<svelte:component this={getIcon(name)} class="w-7 h-7 shrink-0" />
		<h1 class="text-sm">{name.replaceAll("_", " ")}</h1>
	</div>
{:else}
	<div class="rounded-lg border-gray-800 border-4 border-dashed h-15" />
{/if}
