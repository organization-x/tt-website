<script lang="ts">
	import type { Editor } from "@tiptap/core";

	import Check from "$lib/components/icons/Check.svelte";
	import Trash from "$lib/components/icons/Trash.svelte";
	import LinkIcon from "$lib/components/icons/LinkIcon.svelte";
	import ExpandButton from "$lib/components/dashboard/projects/project/ExpandButton.svelte";

	export let editor: Editor;
	export let active: boolean;

	let open = false;
	let input: HTMLInputElement;
	let value = editor.getAttributes("link").src || "";

	// Reactivity to update the input value based on the current link
	$: open, active, (value = editor.getAttributes("link").src || "");

	// Open up either the link editing menu, or, if it isn't currently active as a link, the new link menu
	const onClick = (id: "confirm" | "open" | "delete") => {
		const value = input.value.trim();

		switch (id) {
			case "open":
				open = true;

				break;
			case "confirm":
				if (editor.state.selection.empty) return (open = false);

				if (value.length) {
					// Make the link valid if it doesn't have a protocol
					value.startsWith("http://") || value.startsWith("https://")
						? editor.chain().focus().setLink({ href: value }).run()
						: editor
								.chain()
								.focus()
								.setLink({ href: `https://${value}` })
								.run();
				} else {
					editor.chain().focus().unsetLink().run();
				}

				open = false;

				break;
			case "delete":
				editor.chain().focus().unsetLink().run();

				open = false;
		}
	};
</script>

<ExpandButton
	on:click={() => onClick(open ? "confirm" : "open")}
	{open}
	{active}
>
	<svelte:fragment slot="button">
		{#if open}
			<Check class="w-7 h-7 m-auto" />
		{:else}
			<LinkIcon class="w-6 h-6 m-auto" />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="expanded">
		{#if active}
			<button on:click={() => onClick("delete")} class="my-auto shrink-0">
				<Trash class="w-5 h-5" />
			</button>
		{/if}
		<input
			bind:this={input}
			on:keyup={(e) => (e.key === "Enter" ? onClick("confirm") : null)}
			type="text"
			class="bg-transparent px-2 focus:outline-none"
			placeholder="https://example.com"
			{value}
		/>
	</svelte:fragment>
</ExpandButton>
