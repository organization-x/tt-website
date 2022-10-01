<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Checkbox from "../icons/Checkbox.svelte";

	const dispatch = createEventDispatcher<{
		change: { isSelected: boolean; option: string };
	}>();

	export let option: string;

	let isSelected = false;
</script>

<div
	on:click={() => {
		isSelected = !isSelected;
		dispatch("change", { isSelected, option });
	}}
	class="p-4 flex items-center gap-3 rounded-lg cursor-pointer"
>
	<Checkbox checked={isSelected} class="w-4 h-4" />
	<slot />
</div>
