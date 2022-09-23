<script lang="ts">
	import "highlight.js/styles/atom-one-dark.css";

	import { Editor } from "@tiptap/core";
	import { onMount, onDestroy } from "svelte";
	import { extensions } from "$lib/tiptapExtensions";

	import { createEventDispatcher } from "svelte";
	import OrList from "$lib/components/icons/OrList.svelte";
	import UnList from "$lib/components/icons/UnList.svelte";
	import LinkButton from "$lib/components/dashboard/projects/project/LinkButton.svelte";
	import HeadButton from "$lib/components/dashboard/projects/project/HeadButton.svelte";
	import ImageButton from "$lib/components/dashboard/projects/project/ImageButton.svelte";
	import EditorButton from "$lib/components/dashboard/projects/project/EditorButton.svelte";

	import type { Prisma } from "@prisma/client";
	import type { Content } from "@tiptap/core";
	import Scrollable from "$lib/components/Scrollable.svelte";

	const dispatch = createEventDispatcher<{ editor: Editor }>();

	// Gget the stored content from the parent, this is also bound to for comparison
	export let content: Prisma.JsonValue;

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
		editor = new Editor({
			element: editorElement,
			content: Object.keys(content!).length
				? (content as Content)
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

				// Hacky fix since clientHeight and getBoundingClientRect don't seem to get the correct height immediately
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
				content = editor.getJSON();
			},
			onCreate: () => {
				dispatch("editor", editor);
				content = editor.getJSON();
			},
			extensions
		});
	});

	onDestroy(() => editor && editor.destroy());

	// TODO: Add image upload implementation with cloudflare images
	// TODO: intersection observer sticky scroll
</script>

<div class="flex flex-col relative gap-4p-4 rounded-lg xl:min-w-full">
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
