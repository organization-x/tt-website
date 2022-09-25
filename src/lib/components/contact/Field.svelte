<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Asterisk from "../icons/Asterisk.svelte";

	export let type: string;
	export let title: string;
	export let required = true;
	export let disabled: boolean;
	export let placeholder: string;
	export let page: string;

	const dispatch = createEventDispatcher();

	const email_regex = new RegExp(
		"(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])$"
	);
	const all_nums = new RegExp("^[0-9]*$");
	const website_regex = new RegExp(
		"((http(s)?)://[(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*))+$"
	);

	let isValid = !required;
	let changed = false;
	let isFilled = false;

	// Only dispatch if the previous state of isFilled is different than the new state.
	$: dispatch("change", { page, title, isValid });

	// On input check if the input is filled.
	const onChange = ({ target }: Event) => {
		const { value, name } = target as HTMLInputElement;
		isFilled = value.length > 0;
		changed = true;
		if (!isFilled) {
			if (required) {
				isValid = false;
			} else {
				isValid = true;
			}
			return;
		}
		switch (name) {
			case "first name":
			case "last name": {
				isValid = value[0].toUpperCase() == value[0];
				break;
			}
			case "email": {
				isValid = email_regex.test(value);
				break;
			}
			case "phone number": {
				isValid = all_nums.test(value) && value.length <= 15;
				break;
			}
			case "company website": {
				isValid = website_regex.test(value);
				break;
			}
			default: {
				isValid = true;
				break;
			}
		}
	};
</script>

<div class="mt-8">
	<div class="flex justify-between items-center">
		<h1 class="font-semibold">{title}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>
	<input
		on:input={onChange}
		name={title.toLowerCase()}
		class:border-green-light={isFilled && isValid}
		class:border-red-light={changed && !isValid}
		class:border-transparent={!changed || (!isFilled && isValid)}
		class="w-full h-full px-2 bg-gray-800 flex p-4 mt-2 rounded-lg select-none border-solid border-2 transition-border focus:outline-none"
		{type}
		{disabled}
		{placeholder}
	/>
</div>
