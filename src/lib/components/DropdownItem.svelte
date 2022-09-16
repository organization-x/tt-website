<script lang="ts">
	import Checkbox from "./icons/Checkbox.svelte";
	import RadioSelect from "./icons/RadioSelect.svelte";

	export let radio = false;
	export let selected: boolean;
</script>

<div on:click class="p-4 flex items-center gap-3 rounded-lg cursor-pointer">
	{#if radio}
		<RadioSelect {selected} class="w-6 h-6" />
	{:else}
		<Checkbox checked={selected} class="w-4 h-4" />
	{/if}
	<slot />
</div>
