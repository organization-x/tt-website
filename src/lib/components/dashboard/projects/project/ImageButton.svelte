<script lang="ts">
	import { Action } from "$lib/enums";
	import { FieldType } from "$lib/enums";
	import { validate } from "$lib/validate";
	import Check from "$lib/components/icons/Check.svelte";
	import Trash from "$lib/components/icons/Trash.svelte";
	import Upload from "$lib/components/icons/Upload.svelte";
	import ImageIcon from "$lib/components/icons/ImageIcon.svelte";
	import ExpandButton from "$lib/components/dashboard/projects/project/ExpandButton.svelte";

	import type { Editor } from "@tiptap/core";

	export let editor: Editor;
	export let active: boolean;

	let open = false;
	let isUploaded = false;
	let input: HTMLInputElement;
	let upload: HTMLInputElement;
	let value: string = editor.getAttributes("image").src || "";

	// Reactivity to update the input value based on the current image or hide it if the image is
	// classified as uploaded
	$: open,
		active,
		(value = editor.getAttributes("image").src || ""),
		(isUploaded = value.startsWith("blob:"));

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
				} else editor.commands.deleteSelection();

				open = false;

				break;
			case Action.Delete:
				editor.commands.deleteSelection();

				open = false;
		}
	};

	// Upload an image to Cloudflafe images
	const uploader = () =>
		upload.files?.length &&
		upload.files[0].size <= 1048576 &&
		editor
			.chain()
			.focus()
			.setImage({
				src: URL.createObjectURL(upload.files[0])
			})
			.run() &&
		editor.chain().focus().createParagraphNear().run();
</script>

<ExpandButton
	on:click={() => onAction(open ? Action.Confirm : Action.Open)}
	{open}
	{active}
>
	<svelte:fragment slot="button">
		{#if open}
			<Check class="w-7 h-7 m-auto" />
		{:else}
			<ImageIcon class="w-6 h-6 m-auto" />
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
				<Upload class="w-6 h-6" />

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
