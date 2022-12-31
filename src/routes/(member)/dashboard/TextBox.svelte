<script lang="ts">
	import { getContext } from "svelte";

	import type { Writable } from "svelte/store";

	export let max: number;
	export let value: string;
	export let lightBg = true;
	export let placeholder: string;
	export let title: string | null = null;

	const tabindex = getContext<Writable<number>>("tabindex");
</script>

<div>
	{#if title}
		<h1 class="font-semibold text-xl">{title}</h1>
	{/if}

	<textarea
		bind:value
		class:mt-3={title}
		class:bg-gray-700={lightBg}
		class:bg-gray-900={!lightBg}
		class="w-full h-72 resize-none p-4 pr-1 rounded-lg select-none scrollbar overflow-y-scroll focus:outline-none"
		maxlength={max}
		tabindex={$tabindex}
		{placeholder}
	/>
</div>
