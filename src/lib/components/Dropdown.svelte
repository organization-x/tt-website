<script lang="ts">
	import { onMount } from "svelte";

	export let z = 10;
	export let open = false;

	let parent: HTMLDivElement;

	// Check if click is outside of the dropdown, if so, close it
	onMount(() => {
		const onClick = ({ target }: Event) => {
			if (!parent.contains(target as Node)) open = false;
		};

		addEventListener("click", onClick);

		return () => removeEventListener("click", onClick);
	});
</script>

<div bind:this={parent} class="relative">
	<button
		on:click={() => (open = !open)}
		class:rounded-b-lg={!open}
		class="w-full flex items-center gap-4 p-4 bg-gray-800 duration-100 transition-border rounded-t-lg select-none"
	>
		<slot name="button" />
	</button>
	<div
		class:flex={open}
		class:hidden={!open}
		class="absolute w-full h-fit flex-col inset-0 top-16 shadow-lg bg-gray-800 rounded-b-lg max-h-[15rem] overflow-auto"
		style="z-index: {z}"
	>
		<slot />
	</div>
</div>
