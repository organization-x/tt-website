<script lang="ts">
	import type { ComponentType } from "svelte/types/runtime/internal/dev.js";

	export let name: string;
	let Icon: ComponentType;

	export { Icon as icon };
</script>

<div
	class="justify-center items-center font-semibold bg-gray-800 rounded-lg flex gap-3 p-4"
>
	<svelte:component this={Icon} class="w-10 h-10 shrink-0" />
	<h1>{name.replaceAll("_", " ")}</h1>
</div>
