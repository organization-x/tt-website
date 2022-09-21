<script lang="ts">
	import { slide } from "svelte/transition";

	import { techSkills } from "$lib/enums";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import Input from "$lib/components/dashboard/Input.svelte";
	import TextBox from "$lib/components/dashboard/TextBox.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import TipTap from "$lib/components/dashboard/projects/project/TipTap.svelte";
	import InputSection from "$lib/components/dashboard/projects/project/InputSection.svelte";
	import AuthorSection from "$lib/components/dashboard/projects/project/AuthorSection.svelte";

	import type { PageData } from "./$types";
	import type { TechSkill } from "@prisma/client";
	import type { Content, Editor } from "@tiptap/core";

	export let data: PageData;

	// Store an original copy of the data with typing
	let original = JSON.parse(JSON.stringify(data)) as PageData;

	// Store a reference to the editor for generation of the content
	let editor: Editor;

	let titleError = false;
	let disableForm = false;
	let disableButtons = true;

	const checkConstraints = () => {
		// Check to make sure the title and description arent empty
		if (
			data.project.title.length < 1 ||
			data.project.description.length < 1 ||
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

	$: data.authors, (disableButtons = true), checkConstraints();

	$: data.project.title,
		(disableButtons = true),
		(titleError = false),
		(data.project.title = data.project.title.trim()),
		(data.project.url = data.project.title
			.replaceAll(" ", "-")
			.toLowerCase()),
		checkConstraints();

	$: data.project.description,
		(disableButtons = true),
		(data.project.description = data.project.description.trim()),
		checkConstraints();

	// On cancel, revert the values to their originals and disable the save/cancel buttons
	const onCancel = () => {
		disableButtons = true;
		editor.commands.setContent(original.project.content as Content);
		data.project = JSON.parse(JSON.stringify(original.project));
		data.authors = JSON.parse(JSON.stringify(original.authors));
	};

	const onSave = async () => {
		disableButtons = true;
		disableForm = true;
		editor.setEditable(false);

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
					...data.project,
					date: new Date(),
					content: data.project.content
				},
				authors: data.authors
			} as App.ProjectUpdateRequest)
		}).then(async (res) => {
			// If an error occurs and it's the title, tell the user
			if (!res.ok && (await res.json()).message === "SAME_TITLE")
				titleError = true;
			// Otherwise if the title is fine and there is a new URL, switch the users URL to it without reloading
			else if (data.project.url !== original.project.url)
				history.replaceState(
					{},
					"",
					new URL(
						`/dashboard/projects/${data.project.url}`,
						document.location.href
					)
				);

			disableForm = false;
			editor.setEditable(true);

			// If successful, update the original data
			original = JSON.parse(JSON.stringify(data));
		});
	};
</script>

<div
	class="h-32 bg-cover bg-center border-b-4 relative"
	style="
    border-color: #{data.project.theme};
    background-image: url(/projects/project/placeholder/banner.webp);
    "
>
	<div
		class="absolute inset-0 bg-black/40 flex justify-center items-center gap-2"
	>
		<Pencil class="w-6 h-6 lg:w-8 lg:h-8" />
		<h1 class="text-xl select-none font-semibold lg:text-2xl">Edit</h1>
	</div>
</div>

<div
	disabled={disableForm}
	class:pointer-events-none={disableForm}
	class:opacity-60={disableForm}
	class="p-4 flex flex-col gap-5 max-w-xl mx-auto transition-opacity mt-2 lg:max-w-screen-2xl lg:px-8"
>
	<div>
		<Input
			title="Title"
			bind:value={data.project.title}
			placeholder="Name your project..."
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

	<div class="lg:flex lg:justify-between lg:gap-14">
		<AuthorSection bind:authors={data.authors} user={data.user} />

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
	</div>

	<div class="flex gap-6 mx-auto mt-6">
		<DashButton
			on:click={onCancel}
			disabled={disableButtons}
			class="bg-gray-500"
		>
			Cancel
		</DashButton>
		<DashButton
			on:click={onSave}
			disabled={disableButtons}
			class="bg-blue-light"
		>
			Save
		</DashButton>
	</div>

	<Seperator class="mt-6 mb-2" />

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
