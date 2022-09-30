<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Checkbox from "$lib/components/icons/Checkbox.svelte";

	const dispatch = createEventDispatcher<{
		change: { isSelected: boolean };
	}>();

	let isSelected = false;
</script>

<div
	on:click={() => {
		isSelected = !isSelected;
		dispatch("change", { isSelected });
	}}
	class="p-4 flex items-center gap-3 rounded-lg cursor-pointer"
>
	<Checkbox checked={isSelected} class="w-4 h-4" />
	<slot />
</div>
