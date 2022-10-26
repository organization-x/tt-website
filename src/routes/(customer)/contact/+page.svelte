<script lang="ts">
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Field from "$lib/components/contact/Field.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Select from "$lib/components/contact/Select.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import { FieldType, techSkills, softSkills } from "$lib/enums";
	import FormButton from "$lib/components/contact/FormButton.svelte";

	// Titles for each page of the contact form
	const titles = [
		"First, the basics.",
		"Just some details.",
		"Time to deploy.",
		"That's it!"
	];

	let pageNum = 0;

	// Keep track of all information entered in the form, if a field is option
	// then it is valid by default
	const fields = {
		firstName: {
			value: "",
			valid: false,
			page: 0
		},
		lastName: {
			value: "",
			valid: false,
			page: 0
		},
		email: {
			value: "",
			valid: false,
			page: 0
		},
		phone: {
			value: "",
			valid: true,
			page: 0
		},
		company: {
			value: "",
			valid: false,
			page: 0
		},
		talent: {
			selected: [],
			valid: false,
			page: 1
		},
		website: {
			value: "",
			valid: false,
			page: 1
		},
		doing: {
			selected: [],
			valid: true,
			page: 1
		},
		refer: {
			value: "",
			valid: true,
			page: 1
		},
		subject: {
			value: "",
			valid: false,
			page: 2
		},
		message: {
			value: "",
			valid: false,
			page: 2
		}
	};

	// Check if all fields on the current page are valid
	$: isValid = Object.values(fields).every((field) =>
		field.page === pageNum ? field.valid : true
	);

	// Form submit
	const submit = () => {
		console.log(fields);
		console.log(
			Object.fromEntries(
				Object.entries(fields).map((field) => [
					field[0],
					("selected" in field[1] && field[1].selected) ||
						("value" in field[1] && field[1].value)
				])
			)
		);
		fetch("/api/mail", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(
				Object.fromEntries(
					Object.entries(fields).map((field) => [
						field[0],
						("selected" in field[1] && field[1].selected) ||
							("value" in field[1] && field[1].value)
					])
				)
			)
		});
	};
</script>

<svelte:head>
	<title>Contact Us</title>
</svelte:head>

<Hero
	class="from-purple-light to-purple-dark"
	title="Let us get the party started for you."
	src="/assets/contact/contact.webm"
>
	Give us detailed information on what and who you want to start
	<strong>your journey</strong>.
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
	<MajorHeader>{titles[pageNum]}</MajorHeader>

	<div class="flex flex-col gap-10 mt-8 h-[40rem]">
		{#if pageNum === 0}
			<Field
				bind:value={fields.firstName.value}
				bind:isValid={fields.firstName.valid}
				title="First Name"
				placeholder="First goes here"
			/>

			<Field
				bind:value={fields.lastName.value}
				bind:isValid={fields.lastName.valid}
				title="Last Name"
				placeholder="And now for the last"
			/>

			<Field
				bind:value={fields.email.value}
				bind:isValid={fields.email.valid}
				title="Email"
				placeholder="Our pigeon will be sent here"
				type={FieldType.Email}
			/>

			<Field
				bind:value={fields.phone.value}
				bind:isValid={fields.phone.valid}
				title="Phone Number"
				placeholder="Those digits of yours"
				type={FieldType.Phone}
				required={false}
			/>

			<Field
				bind:value={fields.company.value}
				bind:isValid={fields.company.valid}
				title="Company"
				placeholder="The company were working with"
			/>
		{:else if pageNum === 1}
			<Select
				bind:selected={fields.talent.selected}
				bind:isValid={fields.talent.valid}
				radio={false}
				title="What Talent Do You Need?"
				placeholder="skill(s)"
				options={[...softSkills, ...techSkills]}
			/>

			<Field
				bind:value={fields.website.value}
				bind:isValid={fields.website.valid}
				title="Company Website"
				placeholder="https://company.com"
				type={FieldType.Website}
			/>

			<Select
				bind:selected={fields.doing.selected}
				bind:isValid={fields.doing.valid}
				radio={true}
				title="What Are We Doing?"
				options={[
					"Creating a brand new product",
					"Building on an existing project",
					"Deploying a new product"
				]}
			/>

			<Field
				bind:value={fields.refer.value}
				bind:isValid={fields.refer.valid}
				required={false}
				title="How did you hear about us?"
				placeholder="Google is a friend"
			/>
		{:else if pageNum === 2}
			<Field
				bind:value={fields.subject.value}
				bind:isValid={fields.subject.valid}
				title="Subject"
				placeholder="Give yourself a title"
			/>

			<Field
				bind:value={fields.message.value}
				bind:isValid={fields.message.valid}
				big={true}
				title="Message"
				placeholder="Elaborate and give us plenty of details"
			/>
		{:else if pageNum === 3}
			<div class="text-center my-auto">
				<h1 class="text-2xl font-semibold text-center">
					Your message has been sent!
				</h1>
				<Text>
					We'll get back to you very soon, stay posted and get ready
					for something new.
				</Text>
			</div>
		{/if}
	</div>

	<div class="flex justify-between">
		<FormButton
			disabled={pageNum === 0}
			hidden={pageNum === 0 || pageNum === 3}
			on:click={() => (pageNum -= 1)}
		>
			Back
		</FormButton>

		<FormButton
			disabled={!isValid || pageNum === 3}
			hidden={pageNum === 3}
			on:click={() => (pageNum += 1) && pageNum === 3 && submit()}
		>
			{pageNum === 2 ? "Send" : "Next"}
		</FormButton>
	</div>
</Section>
