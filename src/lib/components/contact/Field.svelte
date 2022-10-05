<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Asterisk from "$lib/components/icons/Asterisk.svelte";
	import type { ChangeValues } from "./formInterfaces.js";
	import {
		emailRegex,
		allNums,
		websiteRegex
	} from "./validityRegexes";

	export let title: string;
	export let prompt = title;
	export let required = true;
	export let disabled: boolean;
	export let placeholder: string;

	enum FormInputs {
		FirstName = "first name",
		LastName = "last name",
		Email = "email",
		PhoneNumber = "phone number",
		CompanyWebsite = "company website"
	}

	const dispatch = createEventDispatcher<ChangeValues>();

	let isValid = !required;
	let changed = false;
	let isFilled = false;
	let input = "";

	// Let the parent know input has changed
	$: dispatch("change", { title, isValid, input });

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
			case FormInputs.Email:
				isValid = emailRegex.test(value);
				break;
			case FormInputs.PhoneNumber:
				isValid =
					allNums.test(value) &&
					8 <= value.length &&
					value.length <= 15;
				break;
			case FormInputs.CompanyWebsite:
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
		{disabled}
		{placeholder}
	/>
</div>
