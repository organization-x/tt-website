<script lang="ts">
	import "$lib/tiptap/hljsTheme.css";

	import { Doc } from "yjs";
	import { Editor } from "@tiptap/core";
	import { techSkills } from "$lib/enums";
	import { fly } from "svelte/transition";
	import { writable } from "svelte/store";
	import { getContext, onMount } from "svelte";
	import { WebsocketProvider } from "y-websocket";
	import { Collaboration } from "@tiptap/extension-collaboration";

	import { user } from "$lib/stores";
	import { dev } from "$app/environment";
	import { Node } from "prosemirror-model";
	import TextBox from "../../TextBox.svelte";
	import LinkButton from "./LinkButton.svelte";
	import HeadButton from "./HeadButton.svelte";
	import ImageButton from "./ImageButton.svelte";
	import Pin from "$lib/icons/general/Pin.svelte";
	import EditorButton from "./EditorButton.svelte";
	import DashButton from "../../DashButton.svelte";
	import AuthorSection from "./AuthorSection.svelte";
	import { extensions } from "$lib/tiptap/extensions";
	import Pencil from "$lib/icons/general/Pencil.svelte";
	import UnList from "$lib/icons/general/UnList.svelte";
	import OrList from "$lib/icons/general/OrList.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import { CollaborationCursor } from "$lib/tiptap/cursor";
	import ShowHide from "$lib/icons/general/ShowHide.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import {
		hashBlob,
		checkObjectURL,
		createObjectURL
	} from "$lib/tiptap/imageHandlers";

	import type { Map as YMap } from "yjs";
	import type { PageData } from "./$types";
	import type { Writable } from "svelte/store";
	import type { TechSkill } from "@prisma/client";
	import type { JSONContent } from "@tiptap/core";

	export let data: PageData;

	// State used for collaboration data syncing
	const enum State {
		Loading,
		Editing,
		Saving,
		Saved,
		Error
	}

	const tabindex = getContext<Writable<number>>("tabindex");

	// Register document for syncing across clients with yjs
	let doc = new Doc();

	// Store a reference to the editor for generation of the content
	let editor: Editor;

	// Create a shared map with the current project data and the state that the editor is in so we can
	// update the UI based on saving or loading events
	const yMap = doc.getMap<App.SharedProject | State>("project");

	// Create a shared map for storing the Cloudflare images ID, buffers of images, and blob urls
	// associated with images in the document so we can determine which images are to be uploaded, kept or deleted
	// and also so that collaborators can see the images without them having to be uploaded to Cloudflare
	let images: YMap<App.Image | string> = doc.getMap("images");

	// Keep track of all currently connected collaboration users for a live view of who is editing
	let users = writable<{ id: string; name: string; color: string }[]>([]);

	let project = data.project;

	// Store an original copy of the data for comparison
	let original = {
		...project,
		skills: [...project.skills],
		authors: [...project.authors.map((author) => ({ ...author }))],
		content: JSON.parse(JSON.stringify(project.content))
	} as App.ProjectWithMetadata;

	// Parse original date into actual date
	original.date = new Date(original.date);

	// Keep track whether this the user is the owner, a collaborator, or an admin
	const isOwner = $user.id === project.ownerId || $user.role === "Admin";

	// Keep track of what nodes or marks are currently active so the buttons can reflect
	// their status
	const isActive: Record<string, boolean> = {
		bold: false,
		italic: false,
		underline: false,
		strike: false,
		bulletList: false,
		orderedList: false,
		link: false,
		image: false,
		heading: false
	};

	let titleError = false;
	let wasFocused = false;
	let disableForm = false;
	let ignoreChange = false;
	let disableEditor = true;
	let ws: WebsocketProvider;
	let disableButtons = true;
	let banner: HTMLInputElement;
	let visible = original.visible;
	let editorElement: HTMLDivElement;
	let pinned = $user.pinnedProjectId === original.id;

	// Use a variable to keep track of the editor's edit status, this way things can be reactive without
	// having to force re-render by reassigning the editor variable
	$: if (editor) editor.setEditable(!disableEditor);

	const checkConstraints = () => {
		if (disableForm || !editor || disableEditor) return;

		disableButtons = true;

		// Keep the project updated with peers if the websocket is connected
		if (ws && ws.wsconnected && !ignoreChange)
			yMap.set("project", {
				...project,
				content: original.content,
				date: project.date.toISOString()
			});

		ignoreChange = false;

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

		// Check if the content has changed
		if (
			project.title === original.title &&
			project.description === original.description &&
			project.skills.toString() === original.skills.toString() &&
			project.authors.length === original.authors.length &&
			project.authors.every(
				(author, i) =>
					original.authors[i]?.user.id === author.user.id &&
					original.authors[i]?.position === author.position
			) &&
			editor.view.state.doc.eq(
				Node.fromJSON(editor.schema, original.content)
			)
		)
			return;

		disableButtons = false;
	};

	$: {
		if (project.title !== original.title) titleError = false;

		checkConstraints();
	}

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

	// On cancel, revert the values to their originals
	const cancel = () => {
		disableButtons = true;
		editor.commands.setContent(original.content as JSONContent);

		// Since nodes are always re-created instead of mutated, set the original state to the new state
		original.content = editor.view.state.doc.toJSON();

		project = {
			...original,
			skills: [...original.skills],
			authors: isOwner ? [...original.authors] : project.authors,
			content: project.content
		};
	};

	const save = () => {
		checkConstraints();

		if (disableButtons || disableForm || disableEditor) return;

		// Trim title and description whitespace
		project.title = project.title.trim();
		project.description = project.description.trim();

		disableForm = true;
		disableButtons = true;

		// Keep track if the editor was focused before the save so it can re-focus
		// after the save is complete and the editor re-enabled
		wasFocused = editor.isFocused;

		disableEditor = true;

		const content = editor.view.state.doc.toJSON();

		// Set the saving state to true to let other clients know that saving is
		// being done
		yMap.set("state", State.Saving);

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
							images: Object.fromEntries(images.entries())
					  } as App.ProjectUpdateRequest)
					: ({
							id: project.id,
							description: project.description,
							skills: project.skills,
							theme: project.theme,
							title: project.title,
							content,
							images: Object.fromEntries(images.entries())
					  } as App.ProjectUpdateRequest)
			)
		}).then(async (res) => {
			// If the status is 205, it is a title that already exists
			if (res.status === 205) {
				titleError = true;
				disableButtons = true;

				yMap.set("state", State.Error);
				yMap.set("state", State.Editing);

				disableForm = false;

				return;
			}

			const data = (await res.json()) as App.ProjectUpdateResponse;

			// Switch the users URL to it without reloading, if it has changed
			if (data.url !== original.url)
				(project.url = data.url) &&
					history.replaceState(
						{},
						"",
						new URL(
							`/dashboard/projects/${project.url}`,
							document.location.href
						)
					);

			// Update the images data to correspond with the new IDs of the images
			// uploaded during this save request
			Object.entries(data.images).forEach(
				([hash, id]) => ((images.get(hash) as App.Image).id = id)
			);

			// Update the original data
			original = {
				...project,
				skills: [...project.skills],
				authors: isOwner
					? [...project.authors.map((author) => ({ ...author }))]
					: original.authors,
				content
			};

			// Change the state to saved and update the project data so that the original data on this client stays the same as the peer
			// without having to create a seperate map. This way if a collaborator, who can not edit the authors data, does a save the
			// peer won't assume that the authors data has changed and will keep an accurate comparison. This also ensures the project
			// content stays accurate and the same across all clients for comparison as well
			yMap.set("state", State.Saved);
			yMap.set("project", {
				...original,
				date: original.date.toISOString()
			});
			yMap.set("state", State.Editing);

			disableForm = false;
			disableEditor = false;

			if (wasFocused) editor.commands.focus();

			wasFocused = false;

			checkConstraints();
		});
	};

	// Update the project's banner
	const updateImage = async () => {
		if (!banner.files?.length || banner.files[0].size > 2000000) return;

		banner.disabled = true;

		const body = new FormData();

		// Append the newly uploaded image to the body
		body.append("file", new File([banner.files![0]], "banner"));

		// Append the type
		body.append("type", "project-banner");

		// Add the project ID
		body.append("id", original.id);

		// Update the image
		await fetch("/api/images", {
			method: "PATCH",
			body
		})
			.then((res) => res.json())
			.then(
				({ theme }: App.ImageUploadResponse) =>
					(original.theme = theme!) && (project.theme = theme!)
			)
			.catch(() => {}); // Ignore errors, the avatar will just stay the same

		// Reset the selected input value and enabled it
		banner.value = "";
		banner.disabled = false;
	};

	// Update visibility of the project
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

	onMount(() => {
		ws = new WebsocketProvider(
			dev ? "ws://localhost:8080" : "wss://teamtomorrow.com",
			project.id,
			doc
		);

		// Generate a random light color for the user
		let color = "#";

		for (let i = 0; i < 3; i++) {
			color += `0${Math.floor(
				((1 + Math.random()) * Math.pow(16, 2)) / 2
			).toString(16)}`.slice(-2);
		}

		// When the websocket connects, check if there's any project data in the shared
		// array, if not, push the project
		ws.once("synced", async () => {
			const peer = Boolean(yMap.size);

			// If this is the first client, let other clients know to wait until the yMap has been
			// updated
			if (!peer) yMap.set("state", State.Loading);

			// Observe changes to sync data across clients
			yMap.observe(({ transaction }) => {
				// Ignore local changes
				if (transaction.local) return;

				const state = yMap.get("state");

				switch (state) {
					// Set once when a save has started, to update the UI
					case State.Saving:
						disableForm = true;
						disableButtons = true;
						wasFocused = editor.isFocused;

						editor.setEditable(false);

						break;
					// Set before the project data is set so that the original data is updated
					case State.Saved:
						const yProject = yMap.get(
							"project"
						) as App.SharedProject;

						original = {
							...yProject,
							date: original.date
						};

						// Switch the users URL to it without reloading
						history.replaceState(
							{},
							"",
							new URL(
								`/dashboard/projects/${original.url}`,
								document.location.href
							)
						);

						break;
					// Set if a title error occurs so all clients see the error
					case State.Error:
						titleError = true;

						break;
					// Set after a save has occured or once the first client has finished
					// it's initial setup, if the form is disabled that means a save occured and the UI
					// state needs to be update once again
					case State.Editing:
						if (disableForm) {
							disableForm = false;
							editor.setEditable(true);
							if (wasFocused) editor.commands.focus();
							wasFocused = false;

							checkConstraints();
						}
				}

				const yProject = yMap.get("project") as App.SharedProject;

				// Tell the constraint checking to not update the yMap with this, as it's already
				ignoreChange = true;

				project = {
					...yProject,
					date: project.date
				};
			});

			editor = new Editor({
				element: editorElement,
				content: project.content as JSONContent,
				editable: false,
				editorProps: {
					attributes: {
						class: "focus-visible:outline-none"
					}
				},
				onTransaction: ({ editor, transaction }) => {
					// Add bottom padding to the editor by measuring the height off all child nodes and adding to it.
					// The reason it's done this way instead of padding is it allows the editor to be clicked on in this
					// virtual padding
					setTimeout(() => {
						let height = 0;

						for (const child of editor.view.dom.children) {
							height += child.clientHeight;
						}

						editor.view.dom.style.height = `calc(20rem + ${height}px)`;
					});

					// Update active items
					for (const key in isActive) {
						isActive[key] = editor.isActive(key);
					}

					// Check if the doc content changed and the editor is editable
					if (!transaction.docChanged || !editor.isEditable) return;

					// Go through all the changed portions of the doc, and for any images, verify that they are using a blob
					// that is valid in this browser. This is needed because a user could, for instance, remove an image in the doc Before
					// a peer joins, then undo it after the peer has joined, causing them to have a non-valid image. It's also better than
					// implementing different checks in many different places. It may seem slow, but since the number of steps is usually between
					// 1-2 it's not thatbad. The real looping occurs in the step map
					transaction.steps.forEach((step) =>
						step.getMap().forEach((_, __, start, end) => {
							editor.state.doc.nodesBetween(
								start,
								end,
								(node) => {
									if (
										node.type.name !== "image" ||
										!(node.attrs!.src as string).startsWith(
											"blob:"
										)
									)
										return;

									const hash = images.get(
										node.attrs!.src
									) as string;

									const image = images.get(hash) as App.Image;

									let url: string | undefined;

									// Check if there's already a blob that works in this browser
									url = image.urls.find(checkObjectURL);

									// If it's already set to the working blob, return
									if (node.attrs!.src === url) return;

									// If there's no working blobs, create one using the image data
									if (!url)
										(url = createObjectURL(
											new Blob([
												new Uint8Array(image.data)
											])
										)) &&
											images.set(url, hash) &&
											image.urls.push(url);

									// Update the HTML but not the actual node, if we update the doc content that will then
									// send the invalid blob URL to all other clients and create an infinite loop
									document
										.querySelector(
											`img[src="${node.attrs!.src}"`
										)
										?.setAttribute("src", url);
								}
							);

							checkConstraints();
						})
					);
				},
				onCreate: async () => {
					// If this is the first client, convert all the Cloudflare image URLs to blobs
					// and set the shared project
					if (!peer) {
						await Promise.all(
							(project.content as JSONContent).content!.map(
								async (node) => {
									if (
										node.type !== "image" ||
										!(node.attrs!.src as string).startsWith(
											PUBLIC_CLOUDFLARE_URL
										)
									)
										return;

									const blob = await fetch(
										node.attrs!.src
									).then((res) => res.blob());
									const url = createObjectURL(blob);

									const hash = await hashBlob(blob);

									images.set(hash, {
										id: node.attrs!.src.split("/")[4],
										data: [
											...new Uint8Array(
												await blob.arrayBuffer()
											)
										],
										urls: [url]
									});

									// Create a pointer for efficiency
									images.set(url, hash);

									node.attrs!.src = url;
								}
							)
						);

						// Set the new content locally
						editor.commands.setContent(
							project.content as JSONContent
						);
					}
					// If the first client is still loading and still connected, wait until it has finished so that all data is loaded
					// in the correct fashion
					else if (
						yMap.get("state") !== State.Editing &&
						ws.awareness.getStates().size > 1
					) {
						await new Promise((res) => {
							if (yMap.get("state") === State.Editing)
								return res(undefined);

							const handler: Parameters<
								typeof yMap.observe
							>[0] = ({ transaction }) => {
								if (transaction.local) return;

								if (yMap.get("state") === State.Editing) {
									yMap.unobserve(handler);
									res(undefined);
								}
							};

							yMap.observe(handler);
						});

						editor.commands.setContent(
							(yMap.get("project") as App.SharedProject)
								.content as JSONContent
						);
					}

					// TipTap re-arranges and modifies content after it has been put in the editor, so we need to make sure
					// all peer clients and this client have that updated information for comparison
					const content =
						editor.view.state.doc.toJSON() as JSONContent;

					let yProject: App.SharedProject | undefined;

					// Transform all peer blob images into blobs that will work in this browser
					if (peer) {
						content.content!.forEach((node) => {
							if (
								node.type !== "image" ||
								!(node.attrs!.src as string).startsWith("blob:")
							)
								return;

							const hash = images.get(node.attrs!.src) as string;

							const url = createObjectURL(
								new Blob([
									new Uint8Array(
										(images.get(hash) as App.Image).data
									)
								])
							);

							// Update the HTML but not the actual node, if we update the doc content that will then
							// send the invalid blob URL to all other clients and create an infinite loop
							document
								.querySelector(`img[src="${node.attrs!.src}"`)
								?.setAttribute("src", url);

							images.set(url, hash);
						});

						yProject = yMap.get("project") as App.SharedProject;

						// Set the original content to the peer's so that we can compare it properly
						original = {
							...original,
							content: yProject.content
						};
					}
					// Otherwise if this is the initial client, set the initial project with the rearranged content
					else {
						yProject = yMap.set("project", {
							...project,
							content,
							date: project.date.toISOString()
						}) as App.SharedProject;

						original = {
							...original,
							content
						};

						// Change the state from loading so peers can finally load, but now with the correct information
						yMap.set("state", State.Editing);
					}

					project = {
						...yProject,
						skills: [...yProject.skills],
						authors: [...yProject.authors],
						date: project.date
					};

					disableEditor = false;
				},
				extensions: [
					Collaboration.configure({
						document: doc
					}),
					CollaborationCursor.extend({
						addStorage() {
							return {
								update: writable(0),
								users,
								cursors: {}
							};
						}
					}).configure({
						provider: ws,
						user: {
							name: $user.name,
							id: $user.id,
							color
						}
					}),
					...extensions
				]
			});
		});

		// Destroy the editor and websocket on unmount
		return () => {
			ws.destroy();
			editor.destroy();
		};
	});
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
			src="{PUBLIC_CLOUDFLARE_URL}/banner-{original.id}/banner?{new Date().getTime()}"
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
			class="opacity-0 w-0 h-0"
			alt="Upload a banner"
			tabindex={$tabindex}
		/>
	{/if}
</label>

<div
	class="flex flex-col gap-8 p-4 max-w-xl mx-auto mt-2 lg:px-12 lg:max-w-screen-xl xl:items-center"
>
	<div
		class:opacity-60={disableForm}
		class:pointer-events-none={disableForm}
		class="flex flex-col gap-5 w-full transition-opacity duration-200"
		aria-disabled={disableForm}
	>
		<div>
			<div class="flex justify-between items-center">
				<h1 class="font-semibold text-xl">Title</h1>

				{#if titleError}
					<p
						transition:fly={{ y: 10, duration: 150 }}
						id="title-error"
						class="text-red-light font-semibold text-sm"
					>
						Title already in use!
					</p>
				{/if}
			</div>

			<div class="flex rounded-lg select-none mt-2 bg-gray-900">
				<input
					bind:value={project.title}
					type="text"
					class="w-full h-full px-2 bg-transparent focus:outline-none p-4 my-auto"
					placeholder="Name your project..."
					maxlength="50"
					tabindex={$tabindex}
					aria-errormessage="title-error"
				/>
			</div>
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
			{isOwner}
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
						groupSelected={project.skills}
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
				class="bg-gray-900 hover:bg-gray-900/60 disabled:hover:bg-gray-900"
			>
				Cancel
			</DashButton>

			<DashButton
				on:click={save}
				disabled={disableButtons}
				class="bg-blue-light hover:bg-blue-light/80 disabled:hover:bg-blue-light"
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

	<div
		class:opacity-60={disableEditor}
		class:pointer-events-none={disableEditor}
		class="w-full transition-opacity duration-200"
		aria-disabled={disableEditor}
	>
		{#if editor}
			<div class="sticky top-0 z-20 border-b-2 border-gray-700 bg-black">
				<Scrollable
					class="before:from-black after:to-black transition-transform duration-200 {$users.length
						? 'h-18 py-1 mb-2'
						: 'h-0'}"
					innerClass="gap-5"
				>
					{#each $users as { id, name, color } (id)}
						<div
							class="flex gap-3 items-center shrink-0 bg-gray-900 rounded-lg px-4 py-2 border-2"
							style="border-color: {color};"
						>
							<img
								class="rounded-full bg-gray-400 w-10 h-10 object-cover object-center"
								height="512"
								width="512"
								src="{PUBLIC_CLOUDFLARE_URL}/avatar-{id}/avatar?{Date.now()}"
								alt="{name}'s avatar"
								loading="lazy"
							/>

							<h1
								class="font-semibold text-lg overflow-auto scrollbar-hidden max-w-44 lg:max-w-60"
							>
								{name.split(/\s+/g)[0]}
							</h1>
						</div>
					{/each}
				</Scrollable>

				<Scrollable
					class="before:from-black after:to-black"
					innerClass="gap-5"
				>
					<HeadButton {editor} active={isActive.heading} />

					<EditorButton
						class="font-bold"
						active={isActive.bold}
						on:click={() =>
							editor.chain().focus().toggleBold().run()}
					>
						B
					</EditorButton>

					<EditorButton
						class="italic"
						active={isActive.italic}
						on:click={() =>
							editor.chain().focus().toggleItalic().run()}
					>
						I
					</EditorButton>

					<EditorButton
						class="underline"
						active={isActive.underline}
						on:click={() =>
							editor.chain().focus().toggleUnderline().run()}
					>
						U
					</EditorButton>

					<EditorButton
						class="line-through"
						active={isActive.strike}
						on:click={() =>
							editor.chain().focus().toggleStrike().run()}
					>
						S
					</EditorButton>

					<EditorButton
						active={isActive.bulletList}
						on:click={() =>
							editor.chain().focus().toggleBulletList().run()}
					>
						<UnList class="w-5 h-5 mx-auto" />
					</EditorButton>

					<EditorButton
						active={isActive.orderedList}
						on:click={() =>
							editor.chain().focus().toggleOrderedList().run()}
					>
						<OrList class="w-5 h-5 mx-auto" />
					</EditorButton>

					<LinkButton {editor} active={isActive.link} />

					<ImageButton bind:images {editor} active={isActive.image} />
				</Scrollable>
			</div>
		{/if}

		<div
			bind:this={editorElement}
			class:hidden={$tabindex === -1}
			class="mt-6"
		/>
	</div>
</div>
