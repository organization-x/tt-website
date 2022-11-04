<script lang="ts">
	import { validate } from "$lib/validate";
	import Asterisk from "$lib/components/icons/general/Asterisk.svelte";

	import type { FieldType } from "$lib/enums";

	export let big = false;
	export let title: string;
	export let value: string;
	export let required = true;
	export let isValid: boolean;
	export let placeholder: string;
	export let type: FieldType | null = null;

	let isFilled = false;

	// On input check if the input is valid and filled after trim
	$: {
		const input = value ? value.trim() : null;

		if (input && input.length) {
			isFilled = true;
			isValid = validate(input, type);
		} else {
			isFilled = false;
			isValid = !required;
		}
	}
</script>

<div>
	<div class="flex justify-between items-center">
		<h1 class="font-semibold">{title}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>

	{#if big}
		<textarea
			bind:value
			class:border-transparent={!isFilled}
			class:border-red-light={isFilled && !isValid}
			class:border-green-light={isFilled && isValid}
			class="w-full h-96 bg-gray-800 resize-none flex p-4 mt-2 rounded-lg select-none border-solid border-2 transition-border focus:outline-none"
			{placeholder}
		/>
	{:else}
		<input
			bind:value
			class:border-transparent={!isFilled}
			class:border-red-light={isFilled && !isValid}
			class:border-green-light={isFilled && isValid}
			class="w-full px-2 bg-gray-800 flex p-4 mt-2 rounded-lg select-none border-solid border-2 transition-border focus:outline-none"
			{placeholder}
		/>
	{/if}
</div>
