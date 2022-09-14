<script lang="ts">
	import RadioSelect from "../../icons/RadioSelect.svelte";

	export let selected: boolean;
</script>

<div on:click class="p-4 flex items-center gap-3 rounded-lg cursor-pointer">
	<RadioSelect {selected} class="w-6 h-6" />
	<slot />
</div>
