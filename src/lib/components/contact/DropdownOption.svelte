<script lang="ts">
	import Checkbox from "$lib/components/icons/Checkbox.svelte";
	export let isSelected = false;
	$: console.log(isSelected);
</script>

<div
	on:click={() => {
		isSelected = !isSelected;
	}}
	class="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors"
	role="checkbox"
	aria-checked={isSelected}
>
	<Checkbox checked={isSelected} class="w-4 h-4" />
	<slot />
</div>
