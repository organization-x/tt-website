<script lang="ts">
	import { debounce } from "$lib/debounce";
	import Search from "$lib/components/icons/Search.svelte";

	let search: string;
	export let placeholder: string;
</script>

<div class="bg-gray-500/40 flex p-4 rounded-lg select-none">
	<Search class="w-5 h-5" />
	<input
		bind:value={search}
		type="text"
		class="w-full h-full px-2 bg-transparent focus:outline-none"
		{placeholder}
	/>
</div>
