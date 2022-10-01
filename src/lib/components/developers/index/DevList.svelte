<script lang="ts">
	import type { ComponentType } from "svelte";

	export let title: string;
	export let icon: ComponentType;
</script>

<div class="flex font-semibold justify-center items-center gap-2 mt-8">
	<svelte:component this={icon} class="w-6 h-6" />
	<h1 class="text-lg">{title}</h1>
</div>
<div class="flex flex-col gap-4 mt-4 md:grid md:grid-cols-2">
	<slot />
</div>
