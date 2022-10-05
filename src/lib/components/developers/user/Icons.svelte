<script lang="ts">
	import { getIcon } from "$lib/getIcon";

	export let icons: string[];
	export let name: string | undefined = undefined;

	let className = "";

	export { className as class };
</script>

<div class={className}>
	{#if name}
		<h2 class="font-semibold text-lg lg:text-xl">{name}</h2>
	{/if}

	<div class="mt-2 grid grid-cols-2 xl:grid-cols-1 gap-2">
		{#each icons as iconName}
			<div class="bg-gray-500/40 flex gap-2 items-center p-2 rounded">
				<svelte:component
					this={getIcon(iconName)}
					class="w-8 h-8 shrink-0"
				/>

				<p class="text-sm">
					{iconName.replaceAll("_", " ")}
				</p>
			</div>
		{/each}
	</div>
</div>
