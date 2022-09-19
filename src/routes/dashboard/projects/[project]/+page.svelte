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
	import Collaborator from "$lib/components/dashboard/projects/project/Collaborator.svelte";
	import InputSection from "$lib/components/dashboard/projects/project/InputSection.svelte";
	import CollabSearch from "$lib/components/dashboard/projects/project/CollabSearch.svelte";

	import type { PageData } from "./$types";
	import type { TechSkill } from "@prisma/client";
	import type { Content, Editor } from "@tiptap/core";

	export let data: PageData;

	// Extract content from fetched project
	let { project } = data;

	// Store an original copy of the data with typing
	let original = JSON.parse(JSON.stringify(data)) as PageData;

	// Store a reference to the editor for generation of the content
	let editor: Editor;

	let titleError = false;
	let disableForm = false;
	let disableButtons = true;

	// Remove collaborators
	const onClick = ({ detail }: CustomEvent<{ id: string }>) => {
		// If the user is the owner, ignore
		if (detail.id === data.user.id) return;

		data.authors.splice(
			data.authors.findIndex((author) => author.id === detail.id),
			1
		);

		// Force re-render
		data.authors = data.authors;
	};

	const onInput = (
		id: "title" | "description" | "authors" | "skills" | "content",
		event: Event
	) => {
		const target = event.target as HTMLInputElement;
		const { detail } = event as CustomEvent;

		disableButtons = true;

		// Authors isn't handled since the change is handled by the child component.
		// This function is called as to update the UI
		switch (id) {
			case "title":
				titleError = false;
				project.title = target.value.trim();
				project.url = project.title.replaceAll(" ", "-").toLowerCase();

				break;
			case "description":
				data.project.description = target.value.trim();

				break;

			case "skills":
				const index = project.skills.indexOf(
					detail.previous as TechSkill
				);

				// If the newly selected value is the same ignore
				if (project.skills[index] === detail.selected) return;

				// If there is a found value for that dropdown, and a selected value then update it, otherwise delete it.
				// If there isn't a found value for that dropdown then push it to the array.
				if (index !== -1) {
					detail.selected
						? (project.skills[index] = detail.selected as TechSkill)
						: project.skills.splice(index, 1);
				} else if (detail.selected)
					project.skills.push(detail.selected as TechSkill);

				project.skills = project.skills; // Reassignment to re-render

				break;

			case "content":
				// This is so we can detect if the user has made any changes
				project.content = editor.getJSON();

				break;
		}

		// Check to make sure the title and description arent empty
		if (
			project.title.length < 1 ||
			project.description.length < 1 ||
			project.skills.length < 2
		)
			return;

		// Check that the content has changed, if yes, enable the buttons
		if (JSON.stringify(original) !== JSON.stringify(data))
			disableButtons = false;
	};

	// On cancel, revert the values to their originals and disable the save/cancel buttons
	const onCancel = () => {
		disableButtons = true;
		editor.commands.setContent(original.project.content as Content);
		project = JSON.parse(JSON.stringify(original.project));
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
					content: project.content
				},
				authors: data.authors
			} as App.ProjectUpdateRequest)
		}).then(async (res) => {
			// If an error occurs and it's the title, tell the user
			if (!res.ok && (await res.json()).message === "SAME_TITLE")
				titleError = true;
			// Otherwise if the title is fine and there is a new URL, switch the users URL to it without reloading
			else if (project.url !== original.project.url)
				history.replaceState(
					{},
					"",
					new URL(
						`/dashboard/projects/${project.url}`,
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
    border-color: #{project.theme};
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

<!-- TODO: Desktop design and done! -->

<div
	disabled={disableForm}
	class:pointer-events-none={disableForm}
	class:opacity-60={disableForm}
	class="p-4 flex flex-col gap-5 max-w-xl mx-auto transition-opacity mt-2 lg:max-w-screen-2xl lg:px-8"
>
	<div>
		<Input
			title="Title"
			value={project.title}
			placeholder="Name your project..."
			on:input={(e) => onInput("title", e)}
		/>
		{#if titleError}
			<p transition:slide class="text-red-light text-sm mt-2 italic">
				Title already in use, please user another!
			</p>
		{/if}
	</div>

	<TextBox
		title="Description"
		value={project.description}
		placeholder="Write a short description of your project..."
		max={300}
		on:input={(e) => onInput("description", e)}
	/>

	<div class="lg:flex lg:justify-between lg:gap-14">
		<InputSection title="Authors">
			{#each data.authors as author}
				<Collaborator
					cantRemove={author.id === data.user.id}
					user={author}
					on:click={onClick}
					on:change={(e) => onInput("authors", e)}
				/>
			{/each}
			<CollabSearch authors={data.authors} />
		</InputSection>

		<InputSection title="Skills">
			{#each { length: 4 } as _, i}
				<Dropdown
					{i}
					radio={true}
					required={i < 2}
					options={techSkills}
					selectedItems={project.skills}
					on:change={(e) => onInput("skills", e)}
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
		content={project.content}
		on:editor={({ detail }) => {
			editor = detail;
			// We re-assign the content of the original since the editor re-arranges the JSON.
			// Not sure why tiptap reorders the generated content
			original.project.content = detail.state.doc.toJSON();
		}}
		on:input={(e) => onInput("content", e)}
	/>
</div>
