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
	import YouTubeButton from "$lib/components/dashboard/projects/project/YouTubeButton.svelte";

	import type { Prisma } from "@prisma/client";
	import type { Content } from "@tiptap/core";

	const dispatch = createEventDispatcher<{ editor: Editor }>();

	// Gget the stored content from the parent, this is also bound to for comparison
	export let content: Prisma.JsonValue;

	let editor: Editor;
	let element: HTMLDivElement;

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
			element,
			content: Object.keys(content!).length
				? (content as Content)
				: undefined,
			editorProps: {
				attributes: {
					class: "focus-visible:outline-none"
				}
			},
			onTransaction: ({ editor }) => {
				// Add bottom padding to the editor by measuring the height off all child nodes and adding to it
				let height = 0;

				Array.from(editor.view.dom.children).forEach((child) => {
					height += child.clientHeight;
				});

				editor.view.dom.style.height = `calc(20rem + ${height}px)`;

				// Update active items
				Object.keys(isActive).forEach(
					(key) => (isActive[key] = editor.isActive(key))
				);

				// Get the content for comparison
				content = editor.getJSON();
			},
			extensions
		});

		dispatch("editor", editor);
	});

	onDestroy(() => editor && editor.destroy());

	// TODO: Add image upload implementation with cloudflare images
	// TODO: Fix weird bullet point behavoir
</script>

<div class="relative">
	{#if editor}
		<div class="absolute inset-0 pointer-events-none">
			<div
				class="flex gap-4 overflow-auto scrollbar-hidden sticky pointer-events-auto top-0 py-4 z-20 bg-black"
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
				<YouTubeButton active={isActive.youtube} {editor} />
			</div>
		</div>
	{/if}

	<div class="flex flex-col gap-4 bg-gray-500/40 p-4 mt-28 rounded-lg">
		<div bind:this={element} />
	</div>
</div>
