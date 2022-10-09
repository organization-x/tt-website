<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Asterisk from "$lib/components/icons/Asterisk.svelte";

	export let title: string;
	export let prompt = title;
	export let required = true;
	export let disabled: boolean;
	export let placeholder: string;
	export let input = "";
	export let isValid = !required;

	let changed = false;

	$: isValid = input.length > 0;

	// On input change check if the input is filled.
	const onChange = ({ target }: Event) => {
		changed = true;
	};
</script>

<div class="mt-8">
	<div class="flex justify-between items-center">
		<h1 class="font-semibold">{prompt}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>
	<textarea
		bind:value={input}
		on:input={onChange}
		name={prompt.toLowerCase()}
		class:border-green-light={isValid}
		class:border-red-light={changed && !isValid && required}
		class:border-transparent={!changed || (!isValid && !required)}
		class="w-full h-96 bg-gray-800 resize-none flex p-4 mt-2 rounded-lg select-none border-solid border-2 transition-border focus:outline-none"
		{disabled}
		{placeholder}
	/>
</div>
