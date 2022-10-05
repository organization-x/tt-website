<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Asterisk from "$lib/components/icons/Asterisk.svelte";
	import type { changeValues } from "./_FormInterfaces.svelte";

	export let title: string;
	export let prompt = title;
	export let required = true;
	export let disabled: boolean;
	export let placeholder: string;
	export let page: string;

	const dispatch = createEventDispatcher<changeValues>();

	let isValid = false;
	let input = "";

	// Let the parent know input has changed
	$: dispatch("change", { page, title, isValid, input });

	// On input change check if the input is filled.
	const onChange = ({ target }: Event) => {
		const { value } = target as HTMLInputElement;
		input = value;
		isValid = value.length > 0;
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
		on:input={onChange}
		name={prompt.toLowerCase()}
		class:border-green-light={isValid}
		class:border-transparent={!isValid}
		class="w-full h-96 bg-gray-800 resize-none flex p-4 mt-2 rounded-lg select-none border-solid border-2 transition-border focus:outline-none"
		{disabled}
		{placeholder}
	/>
</div>
