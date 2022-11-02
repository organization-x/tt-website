<script lang="ts">
	import Checkbox from "$lib/components/icons/general/Checkbox.svelte";
	import RadioSelect from "$lib/components/icons/general/RadioSelect.svelte";

	export let radio = true;
	export let selected: boolean;
</script>

<button
	on:click
	class="p-4 flex items-center gap-3 w-full rounded-lg cursor-pointer"
>
	{#if radio}
		<RadioSelect {selected} class="w-6 h-6 shrink-0" />
	{:else}
		<Checkbox checked={selected} class="w-4 h-4 shrink-0" />
	{/if}
	<slot />
</button>
