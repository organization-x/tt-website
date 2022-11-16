<script lang="ts">
	import "highlight.js/styles/atom-one-dark.css";

	import { Doc } from "yjs";
	import { onMount } from "svelte";
	import { Editor } from "@tiptap/core";
	import { createEventDispatcher } from "svelte";
	import { WebsocketProvider } from "y-websocket";
	import { extensions } from "$lib/tiptapExtensions";
	import { Collaboration } from "@tiptap/extension-collaboration";
	import { CollaborationCursor } from "@tiptap/extension-collaboration-cursor";

	import { user } from "$lib/stores";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import OrList from "$lib/components/icons/general/OrList.svelte";
	import UnList from "$lib/components/icons/general/UnList.svelte";
	import Cursor from "$lib/components/dashboard/projects/Cursor.svelte";
	import LinkButton from "$lib/components/dashboard/projects/LinkButton.svelte";
	import HeadButton from "$lib/components/dashboard/projects/HeadButton.svelte";
	import ImageButton from "$lib/components/dashboard/projects/ImageButton.svelte";
	import EditorButton from "$lib/components/dashboard/projects/EditorButton.svelte";

	import type { JSONContent } from "@tiptap/core";

	const dispatch = createEventDispatcher<{
		editor: Editor;
		save: undefined;
	}>();

	export let blobs: { [key: string]: string };

	// Get the project data from the parent, this is also bound to for comparison
	export let project: App.ProjectWithMetadata;

	let editor: Editor;
	let editorElement: HTMLDivElement;

	// Reassigning the editor variable doesnt update svelte, so this is a workaround
	const isActive: { [key: string]: boolean } = {
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

	onMount(async () => {
		// Go through all the images and convert them to blobs for the editor
		await Promise.all(
			(project.content as JSONContent).content!.map(async (node) => {
				if (
					node.type !== "image" ||
					!(node.attrs!.src as string).startsWith(
						"https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/"
					)
				)
					return;

				const blob = URL.createObjectURL(
					await fetch(node.attrs!.src).then((res) => res.blob())
				);

				// Assign the blob as the source and add it to the blobs object so when the project
				// is saved so we can figure out what images are already uploaded
				node.attrs!.src = blob;
				blobs[blob] = node.attrs!.src as string;
			})
		);

		// Register document with yjs for collaborative editing
		const doc = new Doc();

		const ws = new WebsocketProvider(
			"ws://localhost:8080/dashboard/projects",
			project.id,
			doc
		);

		// Generate a random light color for the user
		let color = "#";

		Array.from({ length: 3 }).forEach(
			() =>
				(color += `0${Math.floor(
					((1 + Math.random()) * Math.pow(16, 2)) / 2
				).toString(16)}`.slice(-2))
		);

		editor = new Editor({
			element: editorElement,
			content: project.content as JSONContent,
			editorProps: {
				attributes: {
					class: "focus-visible:outline-none"
				}
			},
			onTransaction: ({ editor }) => {
				// Add bottom padding to the editor by measuring the height off all child nodes and adding to it.
				// The reason it's done this way instead of padding is it allows the editor to be clicked on in this
				// virtual padding.

				// Hacky fix since clientHeight and clientHeight don't seem to get the correct height immediately
				setTimeout(() => {
					let height = 0;

					Array.from(editor.view.dom.children).forEach((child) => {
						height += child.clientHeight;
					});

					editor.view.dom.style.height = `calc(20rem + ${height}px)`;
				});

				// Update active items
				Object.keys(isActive).forEach(
					(key) => (isActive[key] = editor.isActive(key))
				);

				// Get the content for comparison
				project.content = editor.getJSON();
			},
			onCreate: () => {
				dispatch("editor", editor);
				project.content = editor.getJSON();
			},
			extensions: [
				Collaboration.configure({
					document: doc
				}),
				CollaborationCursor.configure({
					provider: ws,
					user: {
						name: $user.name,
						color
					},
					render(props: { name: string; color: string }) {
						const parent = document.createElement("span");
						new Cursor({ target: parent, props });

						return parent.firstElementChild as HTMLElement;
					}
				}),
				...extensions
			]
		});

		// Destroy the editor on unmount
		return () => {
			editor.destroy();
			ws.disconnect();
			ws.destroy();
		};
	});

	// TODO: Fix collaboration issues like the empty cursor being way too large
</script>

<div class="relative rounded-lg w-full">
	{#if editor}
		<div class="absolute inset-0 pointer-events-none">
			<Scrollable
				class="sticky bg-black pointer-events-auto top-0 z-20 border-b-2 border-gray-700 before:from-black after:to-black"
			>
				<HeadButton active={isActive.heading} {editor} />
				<EditorButton
					class="font-bold"
					active={isActive.bold}
					on:click={() => editor.chain().focus().toggleBold().run()}
				>
					B
				</EditorButton>

				<EditorButton
					class="italic"
					active={isActive.italic}
					on:click={() => editor.chain().focus().toggleItalic().run()}
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
					on:click={() => editor.chain().focus().toggleStrike().run()}
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

				<LinkButton active={isActive.link} {editor} />

				<ImageButton active={isActive.image} {editor} />
			</Scrollable>
		</div>
	{/if}

	<div class="mt-24" bind:this={editorElement} />
</div>
