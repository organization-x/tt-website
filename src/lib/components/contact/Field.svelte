<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Asterisk from "$lib/components/icons/Asterisk.svelte";
	import type { changeValues } from "./_FormInterfaces.svelte";
	import {
		emailRegex,
		allNums,
		anyNum,
		anySymbol,
		websiteRegex
	} from "./_ValidityRegexes.svelte";

	export let type: string;
	export let title: string;
	export let prompt = title;
	export let required = true;
	export let disabled: boolean;
	export let placeholder: string;
	export let page: string;

	enum formInputs {
		firstName = "first name",
		lastName = "last name",
		email = "email",
		phoneNumber = "phone number",
		companyWebsite = "company website"
	}

	const dispatch = createEventDispatcher<changeValues>();

	let isValid = !required;
	let changed = false;
	let isFilled = false;
	let input = "";

	// Let the parent know input has changed
	$: dispatch("change", { page, title, isValid, input });

	// On input check if the input is valid.
	const onChange = ({ target }: Event) => {
		const { value, name } = target as HTMLInputElement;
		input = value;
		isFilled = value.length > 0;
		changed = true;
		if (!isFilled) {
			isValid = !required;
			return;
		}
		switch (name) {
			case formInputs.firstName:
			case formInputs.lastName:
				isValid =
					value[0].toUpperCase() == value[0] &&
					!anyNum.test(value) &&
					!anySymbol.test(value);
				break;
			case formInputs.email:
				isValid = emailRegex.test(value);
				break;
			case formInputs.phoneNumber:
				isValid =
					allNums.test(value) &&
					8 <= value.length &&
					value.length <= 15;
				break;
			case formInputs.companyWebsite:
				isValid = websiteRegex.test(value);
				break;
			default:
				isValid = true;
				break;
		}
	};
</script>

<div class="mt-8">
	<div class="flex justify-between items-center">
		<h1 class="font-semibold">{prompt}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>
	<input
		on:input={onChange}
		name={prompt.toLowerCase()}
		class:border-green-light={isFilled && isValid}
		class:border-red-light={changed && !isValid}
		class:border-transparent={!changed || (!isFilled && isValid)}
		class="w-full h-full px-2 bg-gray-800 flex p-4 mt-2 rounded-lg select-none border-solid border-2 transition-border focus:outline-none"
		{type}
		{disabled}
		{placeholder}
	/>
</div>
