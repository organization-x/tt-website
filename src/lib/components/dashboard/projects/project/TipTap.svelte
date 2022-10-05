<script lang="ts">
	import "highlight.js/styles/atom-one-dark.css";

	import { Doc } from "yjs";
	import { onMount } from "svelte";
	import { Editor } from "@tiptap/core";
	import { WebsocketProvider } from "y-websocket";
	import { extensions } from "$lib/tiptapExtensions";
	import { Collaboration } from "@tiptap/extension-collaboration";

	import { createEventDispatcher } from "svelte";
	import OrList from "$lib/components/icons/OrList.svelte";
	import UnList from "$lib/components/icons/UnList.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import LinkButton from "$lib/components/dashboard/projects/project/LinkButton.svelte";
	import HeadButton from "$lib/components/dashboard/projects/project/HeadButton.svelte";
	import ImageButton from "$lib/components/dashboard/projects/project/ImageButton.svelte";
	import EditorButton from "$lib/components/dashboard/projects/project/EditorButton.svelte";

	import type { Content } from "@tiptap/core";

	const dispatch = createEventDispatcher<{ editor: Editor }>();

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
		heading: false,
		youtube: false
	};

	onMount(() => {
		// Register document with yjs for collaborative editing
		const doc = new Doc();
		// const ws = new WebsocketProvider(
		// 	"ws://localhost:8080/dashboard/projects",
		// 	project.id,
		// 	doc
		// );

		editor = new Editor({
			element: editorElement,
			content: Object.keys(project.content!).length
				? (project.content as Content)
				: undefined,
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
				}, 1);

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
				...extensions
			]
		});

		// Destroy the editor on unmount
		return () => editor.destroy();
	});

	// TODO: Add image upload implementation with cloudflare images
	// TODO: Add image resizing capabilities
	// TODO: Add collaboration
</script>

<div class="relative rounded-lg w-full">
	{#if editor}
		<div class="absolute inset-0 pointer-events-none">
			<Scrollable
				class="sticky bg-black pointer-events-auto top-0 z-20 border-b-2 border-gray-500/40 before:from-black after:to-black"
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
					<UnList class="w-6 h-6 mx-auto" />
				</EditorButton>
				<EditorButton
					active={isActive.orderedList}
					on:click={() =>
						editor.chain().focus().toggleOrderedList().run()}
				>
					<OrList class="w-6 h-6 mx-auto" />
				</EditorButton>
				<LinkButton active={isActive.link} {editor} />
				<ImageButton active={isActive.image} {editor} />
			</Scrollable>
		</div>
	{/if}

	<div class="mt-20" bind:this={editorElement} />
</div>
