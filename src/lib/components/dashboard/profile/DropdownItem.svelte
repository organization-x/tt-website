<script lang="ts">
	import Checkbox from "../../icons/Checkbox.svelte";

	export let selected: boolean;
</script>

<div on:click class="p-4 flex items-center gap-3 rounded-lg cursor-pointer">
	<Checkbox checked={selected} class="w-4 h-4" />
	<slot />
</div>
