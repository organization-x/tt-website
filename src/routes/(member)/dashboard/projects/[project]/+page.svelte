<script lang="ts">
	import { slide } from "svelte/transition";

	import { user } from "$lib/stores";
	import { techSkills } from "$lib/enums";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Pin from "$lib/components/icons/general/Pin.svelte";
	import Input from "$lib/components/dashboard/Input.svelte";
	import TextBox from "$lib/components/dashboard/TextBox.svelte";
	import Pencil from "$lib/components/icons/general/Pencil.svelte";
	import ShowHide from "$lib/components/icons/general/ShowHide.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import TipTap from "$lib/components/dashboard/projects/TipTap.svelte";
	import AuthorSection from "$lib/components/dashboard/projects/AuthorSection.svelte";

	import type { PageData } from "./$types";
	import type { TechSkill } from "@prisma/client";
	import type { Content, Editor } from "@tiptap/core";

	export let data: PageData;

	// Isolate the project data from the rest of the parent data
	let project = data.project;

	// Keep track whether this the user is an owner or a collaborator
	const isOwner = $user.id === project.ownerId;

	// Store an original copy of the data
	let original = JSON.parse(
		JSON.stringify(project)
	) as App.ProjectWithMetadata;

	// Store a reference to the editor for generation of the content
	let editor: Editor;

	// Store the blob URL's of images corresponded to their Cloudflare ID, this is used to
	// prevent double uploading and keep track of which blobs belong to which URL
	let blobs: { [key: string]: string } = {};

	let titleError = false;
	let disableForm = false;
	let disableButtons = true;
	let banner: HTMLInputElement;
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
	}: CustomEvent<{
		selected: string | undefined;
		previous: string | undefined;
	}>) => {
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

	$: if (project.title !== original.title)
		(titleError = false), checkConstraints();

	$: if (project.description !== original.description) checkConstraints();

	$: if (project.authors.length !== original.authors.length)
		checkConstraints();

	$: if (project.content !== original.content && !disableForm)
		checkConstraints();

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

		// Trim title and description whitespace
		project.title = project.title.trim();
		project.description = project.description.trim();

		disableForm = true;
		disableButtons = true;

		const content = editor.getJSON();

		// Create a new array to keep track of image ID's as to remove images that do not
		// appear in the document anymore
		const images: string[] = [];

		// Upload all the new images to Cloudflare so they can be shown to users without blobs
		await Promise.all(
			content.content!.map(async (node) => {
				if (
					node.type !== "image" ||
					!(node.attrs!.src as string).startsWith("blob:")
				)
					return;

				const url = blobs[node.attrs!.src as string];

				// If the image already existed, switch back to it's already existing URL
				if (url)
					return (
						(node.attrs!.src = url) &&
						images.push(url.split("/")[4])
					);

				const body = new FormData();

				// Append the project ID for imge uploading
				body.append("id", project.id);

				// Append the image file
				body.append(
					"file",
					new File(
						[
							await fetch(node.attrs!.src).then((res) =>
								res.blob()
							)
						],
						"image"
					)
				);

				await fetch("/api/images", {
					method: "PUT",
					body
				})
					.then((res) => res.json())
					.then(
						({ id }: App.ImageUploadResponse) =>
							images.push(id) &&
							(node.attrs!.src = `https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/${id}/banner`)
					);
			})
		);

		// Send an update request to the API
		fetch("/api/project", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(
				isOwner
					? ({
							...project,
							content,
							images
					  } as App.ProjectUpdateRequest)
					: ({
							id: project.id,
							content,
							images
					  } as App.ProjectUpdateRequest)
			)
		}).then(async (res) => {
			// If the status is 205, it is most likely a title that already exists
			if (res.status === 205)
				return (
					(disableButtons = true) &&
					(titleError = true) &&
					(disableForm = false)
				);

			// Generate a url based off of the current title
			const url = project.title
				.replaceAll(/[^a-zA-Z0-9\s]/g, "")
				.replaceAll(/\s+/g, "-")
				.toLowerCase();

			// Otherwise if the title is fine and there is a new URL, switch the users URL to it without reloading and update the local copy of the project
			if (url !== original.url) {
				project.url = url;

				history.replaceState(
					{},
					"",
					new URL(
						`/dashboard/projects/${url}`,
						document.location.href
					)
				);
			}

			// If successful, update the original data
			original = JSON.parse(JSON.stringify({ ...project, content }));

			disableForm = false;

			checkConstraints();
		});

		disableButtons = true;
	};

	// Update the project's banner
	const updateImage = async () => {
		if (!banner.files?.length || banner.files[0].size > 1048576) return;

		banner.disabled = true;

		const body = new FormData();

		// Append the newly uploaded image to the body
		body.append("file", new File([banner.files![0]], "banner"));

		// Apend the type
		body.append("type", "project-banner");

		// Add the project ID
		body.append("id", original.id);

		// Update the image
		await fetch("/api/images", {
			method: "PATCH",
			body
		}).catch(() => {}); // Ignore errors, the avatar will just stay the same

		// Reset the selected input value and enabled it
		banner.value = "";
		banner.disabled = false;
	};

	// Update visility of the project
	const toggleVisible = () => {
		fetch("/api/project", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: original.id,
				visible: visible
			} as App.ProjectUpdateRequest)
		}).then(() => {
			original.visible = visible;
			project.visible = visible;
		});
	};

	// Update whether the user has the project pinned
	const togglePinned = () => {
		const pinnedProjectId = pinned ? original.id : null;

		fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: $user.id,
				pinnedProjectId
			} as App.UserUpdateRequest)
		}).then(() => ($user.pinnedProjectId = pinnedProjectId));
	};

	// When the user does CTRL/CMD + S, save the data
	const onKeydown = (e: KeyboardEvent) => {
		if ((e.metaKey && e.key === "s") || (e.ctrlKey && e.key === "s")) {
			e.preventDefault();
			save();
		}
	};
</script>

<svelte:head>
	<title>{original.title} / Project Editor</title>
</svelte:head>

<svelte:window on:keydown={onKeydown} />

<label
	class:cursor-pointer={isOwner}
	class="grid border-b-4"
	style="border-color: #{project.theme}"
>
	{#if banner && banner.disabled}
		<div
			class="animate-grays from-gray-400 to-gray-700 w-full h-32 row-start-1 col-start-1"
		/>
	{:else}
		<img
			src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{original.id}/banner?{new Date().getTime()}"
			width="1920"
			height="1080"
			alt="Banner for '{project.title}'"
			class="object-cover object-center bg-gray-400 w-full h-32 row-start-1 col-start-1"
		/>
	{/if}

	{#if isOwner}
		<div
			class="w-full h-full bg-black/40 flex justify-center items-center gap-2 row-start-1 col-start-1"
		>
			<Pencil class="w-5 h-5" />
			<h1 class="text-xl select-none font-semibold lg:text-2xl">Edit</h1>
		</div>

		<input
			bind:this={banner}
			on:change={updateImage}
			type="file"
			accept=".png, .jpg, .jpeg, .webp, .avif"
			class="hidden"
		/>
	{/if}
</label>

<div
	class="flex flex-col gap-8 p-4 max-w-xl mx-auto mt-2 lg:px-12 lg:max-w-screen-xl xl:items-center"
>
	<div
		disabled={disableForm || !isOwner}
		class:pointer-events-none={disableForm || !isOwner}
		class:opacity-60={disableForm || !isOwner}
		class="flex flex-col gap-5 w-full transition-opacity"
	>
		<div>
			<Input
				bind:value={project.title}
				title="Title"
				placeholder="Name your project..."
				lightBg={false}
				max={50}
			/>

			{#if titleError}
				<p
					transition:slide
					class="text-red-light font-semibold text-center text-sm mt-2"
				>
					Title already in use!
				</p>
			{/if}
		</div>

		<TextBox
			title="Description"
			bind:value={project.description}
			placeholder="Write a short description of your project..."
			max={300}
			lightBg={false}
		/>

		<AuthorSection
			bind:authors={project.authors}
			ownerId={project.ownerId}
		/>

		<div>
			<h1 class="font-semibold text-xl">Skills</h1>
			<div
				class="bg-gray-900 p-4 mt-3 rounded-lg flex flex-col gap-4 lg:grid lg:grid-cols-2"
			>
				{#each { length: 4 } as _, i}
					<Dropdown
						{i}
						required={i < 2}
						options={techSkills}
						selectedItems={project.skills}
						on:change={updateSkills}
					/>
				{/each}
			</div>
		</div>
	</div>

	<div class="flex flex-col items-center my-2">
		<div class="flex gap-6 mx-auto">
			<DashButton
				on:click={cancel}
				disabled={disableButtons}
				class="bg-gray-900 hover:bg-gray-900/60"
			>
				Cancel
			</DashButton>

			<DashButton
				on:click={save}
				disabled={disableButtons}
				class="bg-blue-light hover:bg-blue-light/80"
			>
				Save
			</DashButton>
		</div>

		{#if isOwner}
			<div class="flex gap-6 mx-auto mt-6">
				<DashButton
					icon={true}
					on:click={() => (pinned = !pinned)}
					debounce={{
						bind: pinned,
						func: togglePinned,
						delay: 300
					}}
					class={pinned
						? "bg-blue-light hover:bg-blue-light/80"
						: "bg-gray-900 hover:bg-gray-900/60"}
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
					class="bg-gray-900 hover:bg-gray-900/60"
				>
					<ShowHide crossed={visible} class="w-5 h-5" />
				</DashButton>
			</div>
		{/if}
	</div>

	<TipTap
		bind:blobs
		bind:project
		on:editor={({ detail }) => {
			// For some reason tiptap re-orders some data once it's lodaded into the editor, so we need to change the original to that
			original.content = JSON.parse(JSON.stringify(detail.getJSON()));

			editor = detail;
		}}
	/>
</div>
