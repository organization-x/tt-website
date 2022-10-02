<script lang="ts">
	import { slide } from "svelte/transition";

	import { user } from "$lib/stores";
	import { techSkills } from "$lib/enums";
	import Pin from "$lib/components/icons/Pin.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import Input from "$lib/components/dashboard/Input.svelte";
	import ShowHide from "$lib/components/icons/ShowHide.svelte";
	import TextBox from "$lib/components/dashboard/TextBox.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import InputSection from "$lib/components/dashboard/InputSection.svelte";
	import TipTap from "$lib/components/dashboard/projects/project/TipTap.svelte";
	import AuthorSection from "$lib/components/dashboard/projects/project/AuthorSection.svelte";

	import type { PageData } from "./$types";
	import type { TechSkill } from "@prisma/client";
	import type { Content, Editor } from "@tiptap/core";

	export let data: PageData;

	// Isolate the project data from the rest of the parent data
	let project = data.project;

	// Store an original copy of the data
	let original = JSON.parse(
		JSON.stringify(project)
	) as App.ProjectWithAuthors;

	// Store a reference to the editor for generation of the content
	let editor: Editor;

	let titleError = false;
	let disableForm = false;
	let disableButtons = true;
	let visible = original.visible;
	let pinned = $user.pinnedProjectId === original.id;

	const checkConstraints = () => {
		disableButtons = true;

		const title = project.title.trim();
		const description = project.description.trim();

		if (
			title.length < 1 ||
			title.length > 50 ||
			description.length < 1 ||
			description.length > 300 ||
			project.description.trim().length < 1 ||
			project.skills.length < 2
		)
			return;

		// Check that the content has changed, if yes, enable the buttons
		if (JSON.stringify(original) !== JSON.stringify(project))
			disableButtons = false;
	};

	const updateSkills = ({
		detail
	}: CustomEvent<{ selected: string; previous: string }>) => {
		const index = project.skills.indexOf(detail.previous as TechSkill);

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

		project.skills = project.skills;

		checkConstraints();
	};

	$: project.authors, checkConstraints();

	$: project.title, (titleError = false), checkConstraints();

	$: project.description, checkConstraints();

	// On cancel, revert the values to their originals and disable the save/cancel buttons
	const cancel = () => {
		disableButtons = true;
		editor.commands.setContent(original.content as Content);
		project = JSON.parse(JSON.stringify(original));
		project.authors = JSON.parse(JSON.stringify(original.authors));
	};

	const save = async () => {
		checkConstraints();

		if (disableButtons || disableForm) return;

		disableButtons = true;
		disableForm = true;
		editor.setEditable(false);

		// Trim title and description whitespace
		project.title = project.title.trim();
		project.description = project.description.trim();

		// Send an update request to the API
		await fetch("/api/project", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					id: original.id
				},
				project: {
					...project,
					date: new Date()
				}
			} as App.ProjectUpdateRequest)
		}).then(async (res) => {
			const json = await res.json();

			// If an error occurs and it's the title, tell the user
			if (!res.ok && json.message === "SAME_TITLE") titleError = true;
			// Otherwise if the title is fine and there is a new URL, switch the users URL to it without reloading and update the local copy of the project
			else if (json.url !== original.url) {
				project.url = json.url;

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
			original = JSON.parse(JSON.stringify(project));
		});
	};

	// Update visility of the project
	const toggleVisible = () => {
		fetch("/api/project", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: { id: original.id },
				project: { visible }
			} as App.ProjectUpdateRequest)
		}).then(() => (original.visible = visible));
	};

	// Update whether the user has the project pinned
	const togglePinned = () => {
		const pinnedProjectId = pinned ? null : original.id;

		fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					id: $user.id
				},
				user: { pinnedProjectId }
			} as App.UserUpdateRequest)
		}).then(() => ($user.pinnedProjectId = pinnedProjectId));
	};

	// When the user does CTRL/CMD + S, save the data
	const onKeydown = (e: KeyboardEvent) => {
		if (e.metaKey && e.key === "s") {
			e.preventDefault();
			save();
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<div class="grid border-b-4" style="border-color: #{project.theme}">
	<!-- TODO: Replace placeholder -->
	<img
		src="/assets/projects/project/placeholder/banner.webp"
		width="1920"
		height="1080"
		alt="Banner for '{project.title}'"
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
				bind:value={project.title}
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
			bind:value={project.description}
			placeholder="Write a short description of your project..."
			max={300}
		/>

		<AuthorSection bind:authors={project.authors} user={$user} />

		<InputSection title="Skills">
			{#each { length: 4 } as _, i}
				<Dropdown
					{i}
					radio={true}
					required={i < 2}
					options={techSkills}
					selectedItems={project.skills}
					on:change={updateSkills}
				/>
			{/each}
		</InputSection>

		<div class="flex flex-col items-center">
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
			<div class="flex gap-6 mx-auto mt-6">
				<DashButton
					icon={true}
					on:click={() => (pinned = !pinned)}
					debounce={{
						bind: pinned,
						func: togglePinned,
						delay: 300
					}}
					class={pinned ? "bg-blue-light" : "bg-gray-500/40"}
				>
					<Pin class="w-5 h-5" />
				</DashButton>
				<DashButton
					icon={true}
					on:click={() => (visible = !visible)}
					debounce={{
						bind: visible,
						func: toggleVisible,
						delay: 300
					}}
					class="bg-gray-500/40"
				>
					<ShowHide crossed={visible} class="w-5 h-5" />
				</DashButton>
			</div>
		</div>
	</div>

	<Seperator class="max-w-screen-xl" />

	<TipTap
		bind:content={project.content}
		on:editor={({ detail }) => {
			// For some reason tiptap re-orders some data once it's lodaded into the editor, so we need to change the original to that
			original.content = JSON.parse(JSON.stringify(detail.getJSON()));

			editor = detail;
		}}
	/>
</div>
