<script lang="ts">
	import type { Editor } from "@tiptap/core";

	import Check from "$lib/components/icons/Check.svelte";
	import Trash from "$lib/components/icons/Trash.svelte";
	import YouTube from "$lib/components/icons/YouTube.svelte";
	import ExpandButton from "$lib/components/dashboard/projects/project/ExpandButton.svelte";

	export let editor: Editor;
	export let active: boolean;

	let open = false;
	let input: HTMLInputElement;
	let value = editor.getAttributes("youtube").src || "";

	// Reactivity to update the input value based on the current image
	$: open, active, (value = editor.getAttributes("youtube").src || "");

	// Delete, change src, or add image
	const onClick = (id: "confirm" | "open" | "delete") => {
		const value = input.value.trim();

		switch (id) {
			case "open":
				open = true;

				break;
			case "confirm":
				if (value.length) {
					// Make the link valid if it doesn't have a protocol
					value.startsWith("http://") || value.startsWith("https://")
						? editor
								.chain()
								.focus()
								.setYoutubeVideo({ src: value })
								.run()
						: editor.commands.setYoutubeVideo({
								src: `https://youtube.com/watch?v=${value}`
						  });
				} else {
					editor.commands.deleteSelection();
				}

				open = false;

				break;
			case "delete":
				editor.commands.deleteSelection();

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
			<YouTube class="w-6 h-6 m-auto" />
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
			placeholder="Youtube URL or ID..."
			{value}
		/>
	</svelte:fragment>
</ExpandButton>
