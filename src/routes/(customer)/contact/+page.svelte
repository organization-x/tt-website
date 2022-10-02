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
	};

	let boxes: {
		page: number;
		name: string;
		isValid: boolean;
		value: string | string[];
	}[] = [
		// page 0
		{
			page: 0,
			name: "First Name",
			isValid: false,
			value: ""
		},
		{
			page: 0,
			name: "Last Name",
			isValid: false,
			value: ""
		},
		{
			page: 0,
			name: "Email",
			isValid: false,
			value: ""
		},
		{
			page: 0,
			name: "Phone Number",
			isValid: true,
			value: ""
		},
		{
			page: 0,
			name: "Company",
			isValid: false,
			value: ""
		},

		// page 1
		{
			page: 1,
			name: "Talent",
			isValid: false,
			value: []
		},
		{
			page: 1,
			name: "Company Website",
			isValid: true,
			value: ""
		},
		{
			page: 1,
			name: "What are we coing?",
			isValid: false,
			value: []
		},
		{
			page: 1,
			name: "Heard of Us?",
			isValid: true,
			value: ""
		},

		// page 2
		{
			page: 2,
			name: "Subject",
			isValid: false,
			value: ""
		},
		{
			page: 2,
			name: "Message",
			isValid: false,
			value: ""
		}
	];

	// Check if all required fields are filled
	const onChange = ({
		detail
	}: CustomEvent<{
		page: string;
		title: string;
		isValid: boolean;
		input: string | string[];
	}>) => {
		let input = detail.input;
		let box = boxes.find((obj) => {
			return (
				obj.page == parseInt(detail.page) - 1 &&
				obj.name == detail.title
			);
		});
		box!.isValid = detail.isValid;
		box!.value = input;
		currentPageValid();
	};

	let isValid = false;

	function currentPageValid(): void {
		let page_boxes = boxes.filter((obj) => {
			return obj.page == pageNumber;
		});
		console.log(page_boxes);
		for (let i = 0; i < page_boxes.length; i++) {
			let box = page_boxes[i];
			if (box.isValid == false) {
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
		<Page>
			<Field
				type="text"
				title="First Name"
				disabled={pageNumber !== 0}
				on:change={onChange}
				placeholder="First goes here"
				page="1"
			/>
			<Field
				type="text"
				title="Last Name"
				on:change={onChange}
				disabled={pageNumber !== 0}
				placeholder="And now for the last"
				page="1"
			/>
			<Field
				type="email"
				title="Email"
				on:change={onChange}
				disabled={pageNumber !== 0}
				placeholder="Where should we send our pigeon?"
				page="1"
			/>
			<Field
				type="text"
				title="Phone Number"
				required={false}
				on:change={onChange}
				disabled={pageNumber !== 0}
				placeholder="Your digits, please"
				page="1"
			/>
			<Field
				type="text"
				title="Company"
				on:change={onChange}
				disabled={pageNumber !== 0}
				placeholder="What company are you working for?"
				page="1"
			/>
		</Page>
		<Page>
			<Select
				title="Talent"
				prompt="What Talent Do You Need?"
				placeholder="skill(s)"
				on:change={onChange}
				disabled={pageNumber !== 1}
				options={["Design", "Engineering", "Management"]}
				page="2"
			/>
			<Field
				type="text"
				title="Company Website"
				required={false}
				on:change={onChange}
				disabled={pageNumber !== 1}
				placeholder="https://company.com..."
				page="2"
			/>
			<Select
				title="What are we doing?"
				placeholder="subject(s)"
				on:change={onChange}
				disabled={pageNumber !== 1}
				options={[
					"Creating a brand new product",
					"Building on an existing project",
					"Deploying a new product"
				]}
				page="2"
			/>
			<Field
				type="text"
				title="Heard of Us?"
				prompt="How Did You Hear About Us?"
				required={false}
				on:change={onChange}
				disabled={pageNumber !== 1}
				placeholder="Friends, Family?"
				page="2"
			/>
		</Page>
		<Page>
			<Field
				type="text"
				title="Subject"
				on:change={onChange}
				disabled={pageNumber !== 2}
				placeholder="Give yourself a title"
				page="3"
			/>

			<TextArea
				title="Message"
				on:change={onChange}
				disabled={pageNumber !== 2}
				placeholder="Elaborate on how we can help..."
				page="3"
			/>
		</Page>
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
