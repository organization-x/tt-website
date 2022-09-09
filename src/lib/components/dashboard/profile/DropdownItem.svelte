<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Checkbox from "../../icons/Checkbox.svelte";

	const dispatch = createEventDispatcher();

	export let i: number;
	export let selected: number;
</script>

<div
	on:click={() => {
		dispatch("change", { i });
	}}
	class="p-4 flex items-center gap-3 rounded-lg"
>
	<Checkbox checked={selected} class="w-4 h-4" />
	<slot />
</div>
