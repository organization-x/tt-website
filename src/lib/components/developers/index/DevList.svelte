<script lang="ts">
	import type { ComponentType } from "svelte";

	let icon: ComponentType;
	export let title: string;

	export { icon };
</script>

<div class="flex font-semibold justify-center items-center gap-2 mt-8">
	<svelte:component this={icon} class="w-6 h-6" />
	<h1>{title}</h1>
</div>
<div class="flex flex-col gap-4 mt-4">
	<slot />
</div>
