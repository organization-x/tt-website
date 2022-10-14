<script lang="ts">
	import Asterisk from "$lib/components/icons/Asterisk.svelte";
	import { emailRegex, allNums, websiteRegex } from "./validityRegexes";

	export let title: string;
	export let prompt = title;
	export let required = true;
	export let disabled: boolean;
	export let placeholder: string;
	export let input = "";
	export let isValid = !required;

	enum FormInputs {
		FirstName = "first name",
		LastName = "last name",
		Email = "email",
		PhoneNumber = "phone number",
		CompanyWebsite = "company website"
	}

	let changed = false;
	let isFilled = false;

	// On input check if the input is valid
	const onChange = ({ target }: Event) => {
		const { name } = target as HTMLInputElement;
		isFilled = input.length > 0;
		changed = true;
		if (!isFilled) {
			isValid = !required;
			return;
		}
		switch (name) {
			case FormInputs.Email:
				isValid = emailRegex.test(input);
				break;
			case FormInputs.PhoneNumber:
				isValid =
					allNums.test(input) &&
					8 <= input.length &&
					input.length <= 15;
				break;
			case FormInputs.CompanyWebsite:
				isValid = websiteRegex.test(input);
				break;
			default:
				isValid = true;
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
		bind:value={input}
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
