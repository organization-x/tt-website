<script lang="ts">
	import { createEventDispatcher } from "svelte/internal";

	import Asterisk from "../icons/Asterisk.svelte";

	export let placeholder: string;
	export let title: string;
	export let disabled: boolean;
	export let required = true;

	const dispatch = createEventDispatcher();

	let isFilled = false;

	$: isFilled, dispatch("change", { isFilled });

	const onChange = ({ target }: Event) => {
		const { value } = target as HTMLInputElement;
		isFilled = value.length > 0;
	};
</script>

<div class="mt-8">
	<div class="flex justify-between items-center">
		<h1 class="font-semibold">{title}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>
	<textarea
		on:input={onChange}
		name={title.toLowerCase()}
		class:border-green-light={isFilled}
		class:border-transparent={!isFilled}
		class="w-full h-96 px-2 bg-gray-800 resize-none flex p-4 mt-2 rounded-lg select-none border-solid border-2 transition-border focus:outline-none"
		{disabled}
		{placeholder}
	/>
</div>
