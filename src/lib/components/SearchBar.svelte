<script lang="ts">
	import { createEventDispatcher, onMount, getContext } from "svelte";

	import { debounce } from "$lib/debounce";
	import Search from "$lib/icons/general/Search.svelte";

	import type { Writable } from "svelte/store";

	export let search = "";
	export let lightBg = true;
	export let placeholder: string;

	const tabindex = getContext<Writable<number>>("tabindex");
	const dispatch = createEventDispatcher<{ search: undefined }>();

	// Dispatch an initial search on page load so content is loaded
	onMount(() => dispatch("search"));
</script>

<div
	class:bg-gray-700={lightBg}
	class:bg-gray-900={!lightBg}
	class="flex gap-1 p-4 rounded-lg select-none w-full items-center"
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
		tabindex={$tabindex}
		{placeholder}
	/>
</div>
