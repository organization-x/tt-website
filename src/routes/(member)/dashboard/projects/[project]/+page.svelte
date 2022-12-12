<script lang="ts">
	import "highlight.js/styles/atom-one-dark.css";

	import { Doc } from "yjs";
	import { onMount } from "svelte";
	import { Editor } from "@tiptap/core";
	import { fly } from "svelte/transition";
	import { WebsocketProvider } from "y-websocket";
	import { Collaboration } from "@tiptap/extension-collaboration";
	import { CollaborationCursor } from "@tiptap/extension-collaboration-cursor";

	import { user } from "$lib/stores";
	import { dev } from "$app/environment";
	import { techSkills } from "$lib/enums";
	import { extensions } from "$lib/tiptapExtensions";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import Pin from "$lib/components/icons/general/Pin.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import TextBox from "$lib/components/dashboard/TextBox.svelte";
	import Pencil from "$lib/components/icons/general/Pencil.svelte";
	import UnList from "$lib/components/icons/general/UnList.svelte";
	import OrList from "$lib/components/icons/general/OrList.svelte";
	import ShowHide from "$lib/components/icons/general/ShowHide.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import Cursor from "$lib/components/dashboard/projects/Cursor.svelte";
	import LinkButton from "$lib/components/dashboard/projects/LinkButton.svelte";
	import HeadButton from "$lib/components/dashboard/projects/HeadButton.svelte";
	import {
		hashBlob,
		checkObjectURL,
		createObjectURL
	} from "$lib/imageHandlers";
	import ImageButton from "$lib/components/dashboard/projects/ImageButton.svelte";
	import EditorButton from "$lib/components/dashboard/projects/EditorButton.svelte";
	import AuthorSection from "$lib/components/dashboard/projects/AuthorSection.svelte";

	import type { Map as YMap } from "yjs";
	import type { PageData } from "./$types";
	import type { TechSkill } from "@prisma/client";
	import type { Content, JSONContent } from "@tiptap/core";

	export let data: PageData;

	// State used for collaboration data syncing
	const enum State {
		Editing,
		Saving,
		Saved,
		Error
	}

	// Register document for syncing across clients with yjs
	let doc = new Doc();

	// Store a reference to the editor for generation of the content
	let editor: Editor;

	// Create a shared map with the only item being the project data for
	// syncing across clients
	const yMap = doc.getMap<App.SharedProject | State>("project");

	// Create a shared map for storing the Cloudflare images ID and buffers of images in the document so we can
	// determine which images are to be uploaded, kept or deleted and also so that collaborators
	// can see the images without having to upload them
	let images: YMap<App.Image | string> = doc.getMap("images");

	// Keep track of all currently conencted collaboration users
	let users: { id: string; name: string }[] = [];

	// Isolate the project data from the rest of the parent data and parse the date
	// into an actual javascript date
	let project = data.project;

	// Store an original copy of the data
	let original = {
		...project,
		skills: [...project.skills],
		authors: [...project.authors],
		content: JSON.parse(JSON.stringify(project.content))
	};

	// Parse original date into actual date
	original.date = new Date(original.date);

	// Keep track whether this the user is the owner, a collaborator, or an admin
	const isOwner = $user.id === project.ownerId || $user.role === "Admin";

	// Reassigning the editor variable doesnt update svelte, so this is a workaround
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
	let disableForm = false;
	let ws: WebsocketProvider;
	let disableButtons = true;
	let banner: HTMLInputElement;
	let visible = original.visible;
	let editorElement: HTMLDivElement;
	let pinned = $user.pinnedProjectId === original.id;

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

			let yProject: App.SharedProject | undefined;

			// If this is the first client, convert all the Cloudflare image URLs to blobs
			// and set the shared project and state
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

							const blob = await fetch(node.attrs!.src).then(
								(res) => res.blob()
							);
							const url = createObjectURL(blob);

							const hash = await hashBlob(blob);

							images.set(hash, {
								id: node.attrs!.src.split("/")[4],
								data: [
									...new Uint8Array(await blob.arrayBuffer())
								],
								urls: [url]
							});

							// Create a pointer for efficiency
							images.set(url, hash);

							node.attrs!.src = url;
						}
					)
				);

				yProject = yMap.set("project", {
					...project,
					date: project.date.toISOString()
				}) as App.SharedProject;

				yMap.set("state", State.Editing);
			}

			yMap.observe(async ({ transaction }) => {
				// Ignore local changes
				if (transaction.local) return;

				const state = yMap.get("state");

				// Based on the state, either disable the form and buttons, show the title error, or revert back to editing mode
				switch (state) {
					case State.Saving:
						disableForm = true;
						disableButtons = true;

						editor.setEditable(false);

						break;
					case State.Saved:
						original = {
							...project,
							skills: [...project.skills],
							authors: [...project.authors],
							content: JSON.parse(JSON.stringify(project.content))
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
					case State.Error:
						titleError = true;

						break;
					case State.Editing:
						if (disableForm) {
							disableForm = false;
							editor.setEditable(true);
							editor.commands.focus();
							checkConstraints();
						}
				}

				const yProject = yMap.get("project") as App.SharedProject;

				if (
					project.title === yProject.title &&
					project.description === yProject.description &&
					project.skills.toString() === yProject.skills.toString() &&
					project.authors.every(
						(author, i) =>
							yProject.authors[i]?.user.id === author.user.id
					)
				)
					return;

				project = {
					...yProject,
					date: project.date
				};
			});

			if (!yProject) yProject = yMap.get("project") as App.SharedProject;

			editor = new Editor({
				element: editorElement,
				content: yProject.content as JSONContent,
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

					// This may seem slow, but since the number of steps is usually between 1-2 it's not that
					// bad. The real looping occurs in the step map
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
						})
					);

					// Get the content for comparison
					project.content = editor.getJSON();
				},
				onCreate: async () => {
					const content = editor.getJSON();

					let yProject: App.SharedProject | undefined;

					// Transform all peer blob images into blobs that will work in this browser
					if (peer)
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
					// Otherwise if this is the initial client, update the project with the rearranged content
					else
						yProject = yMap.set("project", {
							...project,
							content,
							date: project.date.toISOString()
						}) as App.SharedProject;

					if (!yProject)
						yProject = yMap.get("project") as App.SharedProject;

					// The original content will be set the current doc state so that we can compare it later
					original = {
						...yProject,
						skills: [...yProject.skills],
						authors: [...yProject.authors],
						date: project.date,
						content: editor.view.state.doc
					};

					project = {
						...yProject,
						skills: [...yProject.skills],
						authors: [...yProject.authors],
						date: project.date
					};

					editor.setEditable(true);
				},
				extensions: [
					Collaboration.configure({
						document: doc
					}),
					CollaborationCursor.configure({
						provider: ws,

						user: {
							name: $user.name,
							id: $user.id,
							color
						},

						render({
							name,
							color
						}: {
							name: string;
							color: string;
							id: string;
						}) {
							const parent = document.createElement("span");
							new Cursor({
								target: parent,
								props: { name, color }
							});

							return parent.firstElementChild as HTMLElement;
						}
					}),
					...extensions
				]
			});

			ws.awareness.on("change", () => {
				const currentUsers: typeof users = [];

				ws.awareness
					.getStates()
					.forEach(
						(state) =>
							state.user.id !== $user.id &&
							currentUsers.push(state.user)
					);

				users = currentUsers;
			});
		});

		// Destroy the editor and websocket on unmount
		return () => {
			ws.destroy();
			editor.destroy();
		};
	});

	$: console.log(users);

	const checkConstraints = () => {
		if (disableForm || !editor || !editor.isEditable) return;

		disableButtons = true;

		// Keep the project updated with peers if the websocket is connected
		if (ws && ws.wsconnected && !disableForm)
			yMap.set("project", {
				...project,
				date: project.date.toISOString()
			});

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

		// Check that the content has changed
		if (
			project.title === original.title &&
			project.description === original.description &&
			project.skills.toString() === original.skills.toString() &&
			project.authors.every(
				(author, i) => original.authors[i]?.user.id === author.user.id
			) &&
			editor.view.state.doc.eq(original.content)
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

	// On cancel, revert the values to their originals and disable the save/cancel buttons
	const cancel = () => {
		disableButtons = true;
		editor.commands.setContent(original.content as Content);

		// Create a transaction that replaces the current state with the old stored state
		editor.view.state.applyTransaction(
			editor.view.state.tr.replaceWith(
				0,
				editor.view.state.doc.content.size,
				original.content
			)
		);

		project = {
			...original,
			skills: [...original.skills],
			authors: [...original.authors]
		};
	};

	const save = async () => {
		checkConstraints();

		if (disableButtons || disableForm) return;

		// Trim title and description whitespace
		project.title = project.title.trim();
		project.description = project.description.trim();

		disableForm = true;
		disableButtons = true;

		editor.setEditable(false);

		const content = editor.view.state.doc;

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
							content: content.toJSON(),
							images: Object.fromEntries(images.entries())
					  } as App.ProjectUpdateRequest)
					: ({
							id: project.id,
							description: project.description,
							skills: project.skills,
							theme: project.theme,
							title: project.title,
							content: content.toJSON(),
							images: Object.fromEntries(images.entries())
					  } as App.ProjectUpdateRequest)
			)
		}).then(async (res) => {
			// If the status is 205, it is most likely a title that already exists
			if (res.status === 205) {
				titleError = true;
				disableButtons = true;

				yMap.set("state", State.Error);
				yMap.set("state", State.Editing);

				disableForm = false;

				return;
			}

			const data = (await res.json()) as App.ProjectUpdateResponse;

			// Switch the users URL to it without reloading
			if (data.url !== original.url)
				(project.url = data.url) &&
					yMap.set("project", {
						...project,
						date: project.date.toISOString()
					}) &&
					history.replaceState(
						{},
						"",
						new URL(
							`/dashboard/projects/${project.url}`,
							document.location.href
						)
					);

			// Update the images data to correspond with the new IDs
			Object.entries(data.images).forEach(
				([hash, id]) => ((images.get(hash) as App.Image).id = id)
			);

			// If successful, update the original data before the request finished
			original = {
				...project,
				skills: [...project.skills],
				authors: [...project.authors],
				content
			};

			// Fire off the event with saved so peers know to update the original
			// data, then switch back to editing
			yMap.set("state", State.Saved);
			yMap.set("state", State.Editing);

			disableForm = false;

			editor.setEditable(true);
			editor.commands.focus();

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

		// Apend the type
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
			class="hidden"
		/>
	{/if}
</label>

<div
	class="flex flex-col gap-8 p-4 max-w-xl mx-auto mt-2 lg:px-12 lg:max-w-screen-xl xl:items-center"
>
	<div
		disabled={disableForm}
		class:opacity-60={disableForm}
		class:pointer-events-none={disableForm}
		class="flex flex-col gap-5 w-full transition-opacity duration-200"
	>
		<div>
			<div class="flex justify-between items-center">
				<h1 class="font-semibold text-xl">Title</h1>

				{#if titleError}
					<p
						transition:fly={{ y: 10, duration: 150 }}
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

	<!-- TODO: Active collaborators design -->
	<!-- TODO: Fix normal username widths -->
	<!-- TODO: Refactor and improve everything -->
	<!-- TODO: Google search console and buiseness setup -->

	<Scrollable class="before:from-black after:to-black">
		{#each users as user (user.id)}
			<h1>{user.name}</h1>
		{/each}
	</Scrollable>

	<div
		disabled={disableForm}
		class:opacity-60={disableForm}
		class:pointer-events-none={disableForm}
		class="relative rounded-lg w-full transition-opacity duration-200"
	>
		{#if editor}
			<div class="absolute inset-0 pointer-events-none">
				<Scrollable
					class="sticky bg-black pointer-events-auto top-0 z-20 border-b-2 border-gray-700 before:from-black after:to-black"
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

		<div class="mt-24" bind:this={editorElement} />
	</div>
</div>
