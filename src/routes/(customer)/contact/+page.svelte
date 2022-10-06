<script lang="ts">
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Page from "$lib/components/contact/Page.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import Field from "$lib/components/contact/Field.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Select from "$lib/components/contact/Select.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import TextArea from "$lib/components/contact/TextArea.svelte";
	import FormButton from "$lib/components/contact/FormButton.svelte";
	import type {
		ChangeValues,
		Boxes
	} from "$lib/components/contact/formInterfaces.js";
	import AiCamp from "$lib/components/AICamp.svelte";
	import { parse } from "cookie";
	import { page } from "$app/stores";

	const titles = [
		"First, the basics.",
		"Just some details.",
		"Time to deploy.",
		"That's it!"
	];

	let pageNumber = 0;
	let element: HTMLFormElement;

	// Scroll to next page of contact form
	const scroll = (next: boolean) => {
		pageNumber = next ? pageNumber + 1 : pageNumber - 1;

		element.scrollTo({
			left: element.children[0].clientWidth * pageNumber,
			behavior: "smooth"
		});
		currentPageValid();

		if (pageNumber === boxes.length) {
			// send form
		}
	};

	let boxes: Boxes[][] = [
		[
			{
				type: "Field",
				name: "First Name",
				isValid: false,
				required: true,
				placeholder: "First goes here",
				value: ""
			},
			{
				type: "Field",
				name: "Last Name",
				isValid: false,
				required: true,
				placeholder: "And now for the last",
				value: ""
			},
			{
				type: "Field",
				name: "Email",
				isValid: false,
				required: true,
				placeholder: "Where should we send our pigeon?",
				value: ""
			},
			{
				type: "Field",
				name: "Phone Number",
				isValid: true,
				required: false,
				placeholder: "Your digits, please",
				value: ""
			},
			{
				type: "Field",
				name: "Company",
				isValid: false,
				required: true,
				placeholder: "What company are you working for?",
				value: ""
			}
		],
		[
			{
				type: "Select",
				name: "What Talent Do You Need?",
				isValid: false,
				required: true,
				options: ["Design", "Engineering", "Management"],
				placeholder: "skill(s)",
				value: []
			},
			{
				type: "Field",
				name: "Company Website",
				isValid: true,
				required: false,
				placeholder: "https://company.com...",
				value: ""
			},
			{
				type: "Select",
				name: "What are we doing?",
				isValid: false,
				required: true,
				placeholder: "subject(s)",
				options: [
					"Creating a brand new product",
					"Building on an existing project",
					"Deploying a new product"
				],
				value: []
			},
			{
				type: "Field",
				name: "How did you hear about us?",
				isValid: true,
				required: false,
				placeholder: "Friends, Family?",
				value: ""
			}
		],
		[
			{
				type: "Field",
				name: "Subject",
				isValid: false,
				required: true,
				placeholder: "Give yourself a title",
				value: ""
			},
			{
				type: "TextArea",
				name: "Message",
				isValid: false,
				required: true,
				placeholder: "Elaborate on how we can help...",
				value: ""
			}
		]
	];

	// Check if all fields are valid
	const onChange = ({ detail }: CustomEvent<ChangeValues["change"]>) => {
		let input = detail.input;
		let box = boxes[pageNumber].find((obj) => obj.name === detail.title);

		if (!box) {
			console.error(
				"CONTACT FORM: INPUT NOT FOUND: \n\n'" +
					detail.title +
					"' NOT IN [" +
					boxes[pageNumber].map((box) => "'" + box.name + "'") +
					"]"
			);
			return;
		}

		box.isValid = detail.isValid;
		box.value = input;
		currentPageValid();
	};

	let isValid = false;

	function currentPageValid(): void {
		for (let i = 0; i < boxes[pageNumber].length; i++) {
			let box = boxes[pageNumber][i];
			if (!box.isValid) {
				isValid = false;
				return;
			}
		}
		isValid = true;
	}
</script>

<svelte:head>
	<title>Contact Us</title>
</svelte:head>

<Hero src="/assets/contact/contact.webm">
	<PageTitle class="from-purple-light to-purple-dark">
		Let us get the party started for you.
	</PageTitle>

	<PageCaption>
		Give us detailed information on what and who you want to start
		<strong>your journey</strong>.
	</PageCaption>
</Hero>

<Section>
	<TextHeader>Before you contact us.</TextHeader>

	<Text>
		When contacting us, please make sure to fill out every part with
		exclusive information so we can respond swiftly with accurate
		information. On the subject field of this form, primarily explain what
		times are availible to meet, who you are interested in and for what
		reason, and any other detail you wish to include that could help the
		both of us as a team.
	</Text>
</Section>

<Section filled={true}>
	<MajorHeader>{titles[pageNumber]}</MajorHeader>

	<form
		bind:this={element}
		class="flex gap-12 overflow-hidden snap-x snap-mandatory"
	>
		{#each boxes as page, pageNum}
			<Page>
				{#each page as box}
					{#if box.type === "Field"}
						<Field
							title={box.name}
							disabled={pageNumber !== pageNum}
							on:change={onChange}
							required={box.required}
							placeholder={box.placeholder}
						/>
					{:else if box.type === "Select"}
						<Select
							title={box.name}
							disabled={pageNumber !== pageNum}
							on:change={onChange}
							options={box.options || ["ERROR"]}
							required={box.required}
							placeholder={box.placeholder}
						/>
					{:else if box.type === "TextArea"}
						<TextArea
							title={box.name}
							disabled={pageNumber !== pageNum}
							on:change={onChange}
							required={box.required}
							placeholder={box.placeholder}
						/>
					{/if}
				{/each}
			</Page>
		{/each}
		<Page>
			<div
				class="flex flex-col h-full text-center justify-center items-center"
			>
				<TextHeader>Your message has been sent.</TextHeader>
				<Text>
					We'll get back to you very soon, stay posted and get ready
					for something new.
				</Text>
			</div>
		</Page>
	</form>

	<div class="flex justify-between">
		<FormButton
			disabled={pageNumber === 0}
			hidden={pageNumber === 0 || pageNumber === 3}
			on:click={() => scroll(false)}
		>
			Back
		</FormButton>
		<FormButton
			disabled={!isValid || pageNumber === 3}
			hidden={pageNumber === 3}
			on:click={() => scroll(true)}
		>
			{pageNumber === 2 ? "Send" : "Next"}
		</FormButton>
	</div>
</Section>
