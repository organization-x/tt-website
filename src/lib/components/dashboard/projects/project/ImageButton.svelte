<script lang="ts">
	import type { Editor } from "@tiptap/core";

	import Check from "$lib/components/icons/Check.svelte";
	import Trash from "$lib/components/icons/Trash.svelte";
	import ImageIcon from "$lib/components/icons/ImageIcon.svelte";
	import ExpandButton from "$lib/components/dashboard/projects/project/ExpandButton.svelte";

	export let editor: Editor;
	export let active: boolean;

	const enum Action {
		Confirm,
		Open,
		Delete
	}

	let open = false;
	let input: HTMLInputElement;
	let value = editor.getAttributes("image").src || "";

	// Reactivity to update the input value based on the current image
	$: open, active, (value = editor.getAttributes("image").src || "");

	// Delete, change src, or add image
	const onAction = (action: Action) => {
		const value = input.value.trim();

		switch (action) {
			case Action.Open:
				open = true;

				break;
			case Action.Confirm:
				if (value.length) {
					// Make the link valid if it doesn't have a protocol
					value.startsWith("http://") || value.startsWith("https://")
						? editor.chain().focus().setImage({ src: value }).run()
						: editor
								.chain()
								.focus()
								.setImage({ src: `https://${value}` })
								.run();
				} else {
					editor.commands.deleteSelection();
				}

				open = false;

				break;
			case Action.Delete:
				editor.commands.deleteSelection();

				open = false;
		}
	};
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
		{/if}
		<input
			bind:this={input}
			on:keyup={(e) =>
				e.key === "Enter" ? onAction(Action.Confirm) : null}
			type="text"
			class="bg-transparent px-2 focus:outline-none"
			placeholder="https://example.com"
			{value}
		/>
	</svelte:fragment>
</ExpandButton>
