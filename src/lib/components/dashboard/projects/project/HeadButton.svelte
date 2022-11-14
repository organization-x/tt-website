<script lang="ts">
	import type { Editor } from "@tiptap/core";

	import HeadingIcon from "$lib/components/icons/general/HeadingIcon.svelte";
	import HeadOneIcon from "$lib/components/icons/general/HeadOneIcon.svelte";
	import HeadTwoIcon from "$lib/components/icons/general/HeadTwoIcon.svelte";
	import HeadThreeIcon from "$lib/components/icons/general/HeadThreeIcon.svelte";
	import ExpandButton from "$lib/components/dashboard/projects/project/ExpandButton.svelte";

	export let editor: Editor;
	export let active: boolean;

	let open = false;
	let selected = editor.getAttributes("heading").level || 0;

	// Update the value on activity change so it doesnt show as selected when not active
	$: active, (selected = editor.getAttributes("heading").level || 0);

	// Change heading type, all toggles
	const onClick = (id: 1 | 2 | 3) => {
		switch (id) {
			case 1:
				editor.chain().focus().toggleHeading({ level: 1 }).run();

				break;
			case 2:
				editor.chain().focus().toggleHeading({ level: 2 }).run();

				break;
			case 3:
				editor.chain().focus().toggleHeading({ level: 3 }).run();

				break;
		}

		// Update the selected heading level
		selected = editor.getAttributes("heading").level || 0;
	};
</script>

<ExpandButton on:click={() => (open = !open)} {open} {active} class="w-40">
	<svelte:fragment slot="button">
		<HeadingIcon class="w-4 h-4" />
	</svelte:fragment>

	<svelte:fragment slot="expanded">
		<button
			on:click={() => onClick(1)}
			class="p-2 h-full {selected === 1 ? ' bg-gray-500' : ''}"
		>
			<HeadOneIcon class="w-5 h-5" />
		</button>

		<button
			on:click={() => onClick(2)}
			class="p-2 h-full {selected === 2 ? ' bg-gray-500' : ''}"
		>
			<HeadTwoIcon class="w-6 h-6" />
		</button>

		<button
			on:click={() => onClick(3)}
			class="p-2 h-full {selected === 3 ? ' bg-gray-500' : ''}"
		>
			<HeadThreeIcon class="w-6 h-6" />
		</button>
	</svelte:fragment>
</ExpandButton>
