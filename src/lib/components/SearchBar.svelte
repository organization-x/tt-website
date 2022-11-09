<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	import { debounce } from "$lib/debounce";
	import Search from "$lib/components/icons/general/Search.svelte";

	const dispatch = createEventDispatcher<{ search: undefined }>();

	export let search = "";
	export let placeholder: string;

	// Dispatch an initial search on page load so content is loaded
	onMount(() => dispatch("search"));
</script>

<div
	class="bg-gray-500/40 flex gap-1 p-4 rounded-lg select-none w-full items-center"
>
	<Search class="w-4 h-4" />

	<input
		bind:value={search}
		on:input
		use:debounce={{
			bind: search,
			func: () => {
				dispatch("search");
			},
			delay: 300
		}}
		type="text"
		class="w-full h-full px-2 bg-transparent focus:outline-none"
		{placeholder}
	/>
</div>
