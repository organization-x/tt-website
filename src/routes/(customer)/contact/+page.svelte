<script lang="ts">
	import { getContext } from "svelte";

	import Hero from "../Hero.svelte";
	import Field from "./Field.svelte";
	import Select from "./Select.svelte";
	import Header from "../Header.svelte";
	import Section from "../Section.svelte";
	import { developers } from "$lib/stores";
	import Text from "$lib/components/Text.svelte";
	import Plus from "$lib/icons/general/Plus.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import { FieldType, techSkills, softSkills } from "$lib/enums";
	import ExternalLink from "$lib/icons/general/ExternalLink.svelte";

	import type { Writable } from "svelte/store";

	// Titles for each page of the contact form
	const titles = [
		"First, the basics",
		"Just some details",
		"Time to deploy",
		"That's it!"
	];

	const timestamp = getContext("timestamp");
	const tabindex = getContext<Writable<number>>("tabindex");

	let pageNum = 0;
	let element: HTMLDivElement;

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
			selected: ["Teamwork"],
			valid: false,
			page: 1
		},
		website: {
			value: "",
			valid: false,
			page: 1
		},
		doing: {
			selected: ["Creating a brand new product"],
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
		},
		developers: {
			selected: [],
			valid: true,
			page: 2
		}
	};

	// Check if all fields on the current page are valid
	$: isValid = Object.values(fields).every((field) =>
		field.page === pageNum ? field.valid : true
	);

	// Form submit
	const submit = () => {
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

	// When the user presses enter and they're inside the form, attempt to go the next page
	const onKeydown = (e: KeyboardEvent) =>
		e.key === "Enter" &&
		element.contains(e.target as Node) &&
		isValid &&
		(pageNum += 1) &&
		pageNum === 3 &&
		submit();

	// Reset the form when the user presses the send another message button
	const reset = () => {
		pageNum = 0;
		isValid = false;
		Object.keys(fields).forEach((key) => {
			// Assign field as a variable so typescript doesn't complain about the typing multiple
			// times
			const field = fields[key as keyof typeof fields] as {
				value?: string;
				selected?: string[];
				valid: boolean;
				page: number;
			};

			field.value ? (field.value = "") : (field.selected = []);
		});
	};

	// Handle a developer being added/remove
	const onClick = (index: number, developer: typeof $developers[0]) =>
		index > -1
			? fields.developers.selected.splice(index, 1) &&
			  (fields.developers.selected = fields.developers.selected)
			: ((fields.developers.selected as typeof developer[]) = [
					...fields.developers.selected,
					developer
			  ]);
</script>

<svelte:head>
	<title>Contact Us</title>
</svelte:head>

<svelte:window on:keydown={onKeydown} />

<Hero
	class="from-purple-light to-purple-dark"
	title="Let us get the party started for you"
	src="/assets/contact/contact.webm"
>
	Give us detailed information on what and who you want to start
	<strong>your journey</strong>.
</Hero>

<Section>
	<Header>Before you contact us</Header>

	<Text>
		When contacting us, please make sure to fill out every part with
		exclusive information so we can respond swiftly with accurate
		information. On the subject field of this form, primarily explain what
		times are available to meet, who you are interested in and for what
		reason, and any other detail you wish to include that could help the
		both of us as a team.
	</Text>
</Section>

<Section filled={true}>
	<Header>{titles[pageNum]}</Header>

	<div
		bind:this={element}
		class="flex flex-col gap-10 mt-8 max-w-xl mx-auto w-full h-[40rem] sm:h-[43rem] lg:max-w-4xl lg:h-[46rem]"
	>
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
					"Building on an existing product",
					"Maintaining an existing product",
					"Unsure/Other"
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

			{#if $developers && $developers.length}
				<div>
					<h1 class="font-semibold">Saved Developers</h1>

					<Scrollable
						vertical={true}
						class="mt-2 rounded-lg h-32 before:from-gray-900 after:to-gray-900 sm:h-36 lg:h-48"
						innerClass="scrollbar-hidden gap-4 lg:grid lg:grid-cols-2 lg:gap-x-6"
					>
						{#each $developers as developer (developer.id)}
							{@const index =
								fields.developers.selected.findIndex(
									({ id }) => id === developer.id
								)}

							<div
								class:bg-white={index > -1}
								class:text-black={index > -1}
								class:bg-gray-700={index === -1}
								class="flex gap-5 p-4 items-center rounded-lg transition-colors lg:h-min"
								aria-checked={index > -1}
							>
								<img
									class="rounded-full bg-gray-400 w-12 h-12 object-cover object-center"
									height="512"
									width="512"
									src="{PUBLIC_CLOUDFLARE_URL}/avatar-{developer.id}/avatar?{timestamp}"
									alt="{developer.name}'s avatar"
									loading="lazy"
								/>

								<h1
									class="font-semibold overflow-auto -ml-2 scrollbar-hidden"
								>
									{developer.name.split(/\s+/g)[0]}
								</h1>

								<a
									href="/developers/{developer.url}"
									target="_blank"
									rel="noreferrer noopener"
									class="ml-auto"
								>
									<ExternalLink class="w-4 h-4" />
								</a>

								<button
									on:click={() => onClick(index, developer)}
									tabindex={$tabindex}
								>
									<Plus
										class="w-4 h-4 transition-transform{index >
										-1
											? ' rotate-45'
											: ''}"
									/>
								</button>
							</div>
						{/each}
					</Scrollable>
				</div>
			{/if}
		{:else if pageNum === 3}
			<div class="text-center my-auto">
				<h1 class="text-2xl font-semibold text-center">
					Your message has been sent!
				</h1>

				<Text>
					We'll get back to you very soon, stay posted and get ready
					for something new.
				</Text>

				<button
					on:click={reset}
					class="px-4 py-3 mt-8 bg-white text-black rounded-lg"
				>
					Send another message
				</button>
			</div>
		{/if}
	</div>

	<div class="flex justify-between max-w-xl mx-auto w-full lg:max-w-4xl">
		<button
			on:click={() => (pageNum -= 1)}
			disabled={pageNum === 0}
			class:opacity-0={pageNum === 0 || pageNum === 3}
			class="px-4 py-3 mt-8 bg-white text-black transition-colors rounded-lg w-24 disabled:bg-gray-500"
			tabindex={$tabindex}
		>
			Back
		</button>

		<button
			on:click={() =>
				isValid && (pageNum += 1) && pageNum === 3 && submit()}
			disabled={!isValid || pageNum === 3}
			class:opacity-0={pageNum === 3}
			class="px-4 py-3 mt-8 bg-white text-black transition-colors rounded-lg w-24 disabled:bg-gray-500"
			tabindex={$tabindex}
		>
			{pageNum === 2 ? "Send" : "Next"}
		</button>
	</div>
</Section>
