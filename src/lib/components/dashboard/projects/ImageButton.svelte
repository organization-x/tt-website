<script lang="ts">
	import { onMount } from "svelte";

	import { Action } from "$lib/enums";
	import { FieldType } from "$lib/enums";
	import { validate } from "$lib/validate";
	import { baseEncode, hashBlob } from "$lib/imageHandlers";
	import Check from "$lib/components/icons/general/Check.svelte";
	import Trash from "$lib/components/icons/general/Trash.svelte";
	import Upload from "$lib/components/icons/general/Upload.svelte";
	import ImageIcon from "$lib/components/icons/general/ImageIcon.svelte";
	import ExpandButton from "$lib/components/dashboard/projects/ExpandButton.svelte";

	import type { Map as YMap } from "yjs";
	import type { Editor } from "@tiptap/core";

	export let editor: Editor;
	export let active: boolean;
	export let images: YMap<App.Image | string>;

	let open = false;
	let reader: FileReader;
	let isUploaded = false;
	let input: HTMLInputElement;
	let upload: HTMLInputElement;
	let value: string = editor.getAttributes("image").src || "";

	// Reactivity to update the input value based on the current image or hide it if the image is
	// classified as uploaded
	$: open,
		active,
		(value = editor.getAttributes("image").src || ""),
		value.startsWith("blob:") &&
			(isUploaded = true) &&
			(value = "Uploaded Image");

	// Delete, change src, or add image
	const onAction = (action: Action) => {
		const value = input.value.trim();

		switch (action) {
			case Action.Open:
				open = true;

				break;
			case Action.Confirm:
				if (isUploaded) return (open = false);

				// Disallow directly linking to images from our Cloudflare
				if (
					value.startsWith(
						"https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/"
					)
				)
					return;

				if (value.length) {
					// Keep track of whether we start off with an image
					const wasActive = active;

					// Make the link valid if it doesn't have a protocol
					if (
						value.startsWith("http://") ||
						value.startsWith("https://")
					)
						editor.chain().focus().setImage({ src: value }).run();
					else if (
						validate(value, FieldType.Website) &&
						!value.startsWith("blob:")
					) {
						editor
							.chain()
							.focus()
							.setImage({ src: `https://${value}` })
							.run();
					} else return;

					// If we just added an image, inset a paragraph below it
					if (!wasActive)
						editor.chain().focus().createParagraphNear().run();
				} else active && editor.commands.deleteSelection();

				open = false;

				break;
			case Action.Delete:
				editor.commands.deleteSelection();

				open = false;
		}
	};

	// Upload an image to Cloudflare images, 2MB max size
	const uploader = async () => {
		if (!upload.files?.length || upload.files[0].size > 2000000) return;

		// Turn the file into a SHA-1 hash so the same image doesn't create seperate
		// entries
		const key = await hashBlob(upload.files[0]);

		// Since image data isn't deleted until a save occurs, check to see if this image already exists
		const image = images.get(key) as App.Image;
		let src = image?.urls.find(async (url) => {
			try {
				return await fetch(url).then((res) => res.ok);
			} catch {
				return false;
			}
		});

		if (!src) src = URL.createObjectURL(upload.files![0]);

		editor
			.chain()
			.focus()
			.setImage({ src: src! })
			.createParagraphNear()
			.run();

		// If there's an image but no valid URL, create a new URL and push it, otherwise, if
		// there's no previous image at all create a URL and an image. This happens after the editor
		// adds it since collaborators need to iterate through nodes to set their src attributes
		if (image && !src) image.urls.push(src) && images.set(src, key);
		else if (!image) {
			images.set(key, {
				urls: [src],
				data: await baseEncode(reader, upload.files[0])
			});

			images.set(src, key);
		}

		// Reset the input
		upload.value = "";
	};

	onMount(() => (reader = new FileReader()));
</script>

<ExpandButton
	on:click={() => onAction(open ? Action.Confirm : Action.Open)}
	{open}
	{active}
	class="w-56"
>
	<svelte:fragment slot="button">
		{#if open}
			<Check class="w-5 h-5" />
		{:else}
			<ImageIcon class="w-4 h-4" />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="expanded">
		{#if active}
			<button
				on:click={() => onAction(Action.Delete)}
				class="my-auto shrink-0"
			>
				<Trash class="w-5 h-5" />
			</button>
		{:else}
			<label class="shrink-0 my-auto cursor-pointer">
				<Upload class="w-5 h-5" />

				<input
					bind:this={upload}
					on:change={uploader}
					type="file"
					accept=".png, .jpg, .jpeg, .webp, .avif"
					class="hidden"
				/>
			</label>
		{/if}

		<input
			bind:this={input}
			on:keyup={(e) =>
				e.key === "Enter" ? onAction(Action.Confirm) : null}
			type="text"
			disabled={isUploaded}
			class:opacity-70={isUploaded}
			class="bg-transparent shrink-0 focus:outline-none"
			placeholder="https://example.com"
			{value}
		/>
	</svelte:fragment>
</ExpandButton>
