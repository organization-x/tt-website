<script lang="ts">
	import { slide } from "svelte/transition";

	import { techSkills } from "$lib/enums";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import Input from "$lib/components/dashboard/Input.svelte";
	import TextBox from "$lib/components/dashboard/TextBox.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import InputSection from "$lib/components/dashboard/InputSection.svelte";
	import TipTap from "$lib/components/dashboard/projects/project/TipTap.svelte";
	import AuthorSection from "$lib/components/dashboard/projects/project/AuthorSection.svelte";

	import type { PageData } from "./$types";
	import type { TechSkill } from "@prisma/client";
	import type { Content, Editor } from "@tiptap/core";

	export let data: PageData;

	// Store an original copy of the data
	let original = JSON.parse(JSON.stringify(data)) as PageData;

	// Store a reference to the editor for generation of the content
	let editor: Editor;

	let titleError = false;
	let disableForm = false;
	let disableButtons = true;

	const checkConstraints = () => {
		disableButtons = true;

		const title = data.project.title.trim();
		const description = data.project.description.trim();

		if (
			title.length < 1 ||
			title.length > 50 ||
			description.length < 1 ||
			description.length > 300 ||
			data.project.description.trim().length < 1 ||
			data.project.skills.length < 2
		)
			return;

		// Check that the content has changed, if yes, enable the buttons
		if (JSON.stringify(original) !== JSON.stringify(data))
			disableButtons = false;
	};

	const updateSkills = ({
		detail
	}: CustomEvent<{ selected: string; previous: string }>) => {
		const index = data.project.skills.indexOf(detail.previous as TechSkill);

		// If the newly selected value is the same ignore
		if (data.project.skills[index] === detail.selected) return;

		// If there is a found value for that dropdown, and a selected value then update it, otherwise delete it.
		// If there isn't a found value for that dropdown then push it to the array.
		if (index !== -1) {
			detail.selected
				? (data.project.skills[index] = detail.selected as TechSkill)
				: data.project.skills.splice(index, 1);
		} else if (detail.selected)
			data.project.skills.push(detail.selected as TechSkill);

		data.project.skills = data.project.skills;

		checkConstraints();
	};

	$: data.project.authors, checkConstraints();

	$: data.project.title, (titleError = false), checkConstraints();

	$: data.project.description, checkConstraints();

	// On cancel, revert the values to their originals and disable the save/cancel buttons
	const cancel = () => {
		disableButtons = true;
		editor.commands.setContent(original.project.content as Content);
		data.project = JSON.parse(JSON.stringify(original.project));
		data.project.authors = JSON.parse(
			JSON.stringify(original.project.authors)
		);
	};

	const save = async () => {
		disableButtons = true;
		disableForm = true;
		editor.setEditable(false);

		// Trim title and description whitespace
		data.project.title = data.project.title.trim();
		data.project.description = data.project.description.trim();

		// Split the authors property from the project since thats not how it's stored in postgres.
		// That's added for ease of use within this codebase
		const { authors, ...project } = data.project;

		// Send an update request to the API
		await fetch("/api/project", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					id: data.project.id
				},
				project: {
					...project,
					date: new Date(),
					content: data.project.content
				},
				authors
			} as App.ProjectUpdateRequest)
		}).then(async (res) => {
			const json = await res.json();

			// If an error occurs and it's the title, tell the user
			if (!res.ok && json.message === "SAME_TITLE") titleError = true;
			// Otherwise if the title is fine and there is a new URL, switch the users URL to it without reloading and update the local copy of the project
			else if (json.url !== original.project.url) {
				data.project.url = json.url;

				history.replaceState(
					{},
					"",
					new URL(
						`/dashboard/projects/${json.url}`,
						document.location.href
					)
				);
			}

			disableForm = false;
			disableButtons = true;
			editor.setEditable(true);

			// If successful, update the original data
			original = JSON.parse(JSON.stringify(data));
		});
	};
</script>

<div class="grid border-b-4" style="border-color: #{data.project.theme}">
	<!-- TODO: Replace placeholder -->
	<img
		src="/assets/projects/project/placeholder/banner.webp"
		width="1920"
		height="1080"
		alt="Banner for '{data.project.title}'"
		class="object-cover object-center w-full h-32 row-start-1 col-start-1"
	/>

	<button
		class="w-full h-full bg-black/40 flex justify-center items-center gap-2 row-start-1 col-start-1"
	>
		<Pencil class="w-6 h-6 lg:w-8 lg:h-8" />
		<h1 class="text-xl select-none font-semibold lg:text-2xl">Edit</h1>
	</button>
</div>

<div
	disabled={disableForm}
	class:pointer-events-none={disableForm}
	class:opacity-60={disableForm}
	class="flex flex-col gap-8 p-4 max-w-xl mx-auto transition-opacity mt-2 lg:px-12 lg:max-w-screen-3xl xl:items-center"
>
	<div class="flex flex-col gap-5 w-full lg:max-w-screen-xl">
		<div>
			<Input
				bind:value={data.project.title}
				title="Title"
				placeholder="Name your project..."
				max={50}
			/>
			{#if titleError}
				<p transition:slide class="text-red-light text-sm mt-2 italic">
					Title already in use, please user another!
				</p>
			{/if}
		</div>

		<TextBox
			title="Description"
			bind:value={data.project.description}
			placeholder="Write a short description of your project..."
			max={300}
		/>

		<AuthorSection bind:authors={data.project.authors} user={data.user} />

		<InputSection title="Skills">
			{#each { length: 4 } as _, i}
				<Dropdown
					{i}
					radio={true}
					required={i < 2}
					options={techSkills}
					selectedItems={data.project.skills}
					on:change={updateSkills}
				/>
			{/each}
		</InputSection>

		<div class="flex gap-6 mx-auto mt-6">
			<DashButton
				on:click={cancel}
				disabled={disableButtons}
				class="bg-gray-500"
			>
				Cancel
			</DashButton>
			<DashButton
				on:click={save}
				disabled={disableButtons}
				class="bg-blue-light"
			>
				Save
			</DashButton>
		</div>
	</div>

	<Seperator class="max-w-screen-xl" />

	<TipTap
		bind:content={data.project.content}
		on:editor={({ detail }) => {
			// For some reason tiptap re-orders some data once it's lodaded into the editor, so we need to change the original to that
			original.project.content = JSON.parse(
				JSON.stringify(detail.getJSON())
			);

			editor = detail;
		}}
	/>
</div>
