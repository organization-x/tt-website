<script lang="ts">
	import type { ComponentType } from "svelte";

	export let name: string;
	let Icon: ComponentType;

	export { Icon as icon };
</script>

<div
	class="flex justify-center items-center font-semibold bg-gray-800 rounded-lg gap-3 p-4"
>
	<svelte:component this={Icon} class="w-7 h-7 shrink-0" />
	<h1 class="text-sm">{name.replaceAll("_", " ")}</h1>
</div>
