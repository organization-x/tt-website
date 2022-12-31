<script lang="ts">
	import { getContext } from "svelte";

	import { Action } from "$lib/enums";
	import ExpandButton from "./ExpandButton.svelte";
	import Check from "$lib/icons/general/Check.svelte";
	import Trash from "$lib/icons/general/Trash.svelte";
	import LinkIcon from "$lib/icons/general/LinkIcon.svelte";

	import type { Editor } from "@tiptap/core";
	import type { Writable } from "svelte/store";

	export let editor: Editor;
	export let active: boolean;

	const tabindex = getContext<Writable<number>>("tabindex");

	let open = false;
	let input: HTMLInputElement;
	let value = editor.getAttributes("link").href || "";

	// Reactivity to update the input value based on the current link
	$: open, active, (value = editor.getAttributes("link").href || "");

	// Open up either the link editing menu, or, if it isn't currently active as a link, the new link menu
	const onAction = (action: Action) => {
		const value = input.value.trim();

		switch (action) {
			case Action.Open:
				open = true;

				break;
			case Action.Confirm:
				if (editor.state.selection.empty) return (open = false);

				if (value.length) {
					// Generate a random ID to keep track of this mark so it
					// can be properly destroyed later
					const id = Math.random().toString(36).substring(2, 9);

					// Make the link valid if it doesn't have a protocol
					value.startsWith("http://") || value.startsWith("https://")
						? editor
								.chain()
								.focus()
								.setLink({ href: value, id })
								.run()
						: editor
								.chain()
								.focus()
								.setLink({ href: `https://${value}`, id })
								.run();
				} else {
					editor
						.chain()
						.focus()
						.unsetLink(editor.getAttributes("link").id)
						.run();
				}

				open = false;

				break;
			case Action.Delete:
				editor
					.chain()
					.focus()
					.unsetLink(editor.getAttributes("link").id)
					.run();

				open = false;
		}
	};
</script>

<ExpandButton
	on:click={() => onAction(open ? Action.Confirm : Action.Open)}
	{open}
	{active}
	class={active ? "w-60" : "w-48"}
>
	<svelte:fragment slot="button">
		{#if open}
			<Check class="w-5 h-5" />
		{:else}
			<LinkIcon class="w-4 h-4" />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="expanded">
		{#if active}
			<button
				on:click={() => onAction(Action.Delete)}
				class="my-auto shrink-0"
				tabindex={open ? $tabindex : -1}
				aria-hidden={!open}
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
			tabindex={open ? $tabindex : -1}
			aria-hidden={!open}
			{value}
		/>
	</svelte:fragment>
</ExpandButton>
