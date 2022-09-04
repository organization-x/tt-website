<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Checkbox from "../icons/Checkbox.svelte";

	const dispatch = createEventDispatcher();

	let isSelected = false;
</script>

<div
	on:click={() => {
		isSelected = !isSelected;
		dispatch("change", { isSelected });
	}}
	class="p-4 flex items-center gap-3 rounded-lg"
>
	<Checkbox checked={isSelected} class="w-4 h-4" />
	<slot />
</div>
