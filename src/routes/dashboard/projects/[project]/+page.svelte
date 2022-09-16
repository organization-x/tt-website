<script lang="ts">
	import { generateHTML } from "@tiptap/html";
	import StarterKit from "@tiptap/starter-kit";

	import Pencil from "$lib/components/icons/Pencil.svelte";
	import Input from "$lib/components/dashboard/Input.svelte";

	import type { PageData } from "./$types";
	import type { JSONContent } from "@tiptap/core";
	import TextBox from "$lib/components/dashboard/TextBox.svelte";
	import Collaborator from "$lib/components/dashboard/projects/project/Collaborator.svelte";
	import Search from "$lib/components/icons/Search.svelte";
	import InputTitle from "$lib/components/dashboard/projects/project/InputTitle.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";

	export let data: PageData;

	const html = generateHTML(data.project.content as JSONContent, [
		StarterKit
	]);

	const { title, theme, skills, snippet } = data.project;

	// Remove collaborators
	const onClick = ({ detail }: CustomEvent<{ id: string }>) => {
		// If the user is the owner, ignore
		// if (detail.id === data.user.id) return;

		data.authors.splice(
			data.authors.findIndex((author) => author.id === detail.id),
			1
		);

		data.authors = data.authors;
	};

	// TODO: Create skill dropdown component for everywhere
</script>

<div
	class="h-32 bg-cover bg-center border-b-4 relative"
	style="
    border-color: #{theme};
    background-image: url(/projects/project/placeholder/banner.webp);
    "
>
	<div
		class="absolute inset-0 bg-black/40 flex justify-center items-center gap-2"
	>
		<Pencil class="w-6 h-6 lg:w-8 lg:h-8" />
		<h1 class="text-xl select-none font-semibold lg:text-2xl">Edit</h1>
	</div>
</div>

<div class="p-4 flex flex-col gap-5 max-w-screen-lg mx-auto">
	<Input placeholder="Name your project..." value={title}>
		<InputTitle slot="label">Title</InputTitle>
	</Input>

	<TextBox
		value={snippet}
		placeholder="Write a short description of your project..."
		max={300}
	>
		<InputTitle slot="label">Snippet</InputTitle>
	</TextBox>

	<div>
		<InputTitle>Collaborators</InputTitle>
		<div
			class="flex flex-col gap-4 bg-gray-500/40 p-4 overflow-auto mt-3 rounded-lg"
		>
			{#each data.authors as author}
				<Collaborator
					cantRemove={author.id === data.user.id}
					user={author}
					on:click={onClick}
				/>
			{/each}
			<!-- TODO: Add actual search functionality and be able to add collaborators -->
			<Input placeholder="Search for collaborators...">
				<Search slot="icon" class="w-6 h-6 mx-auto" />
			</Input>
		</div>
	</div>

	<div>
		<InputTitle>Skills</InputTitle>
		{#each { length: 4 } as _, i}
			<Dropdown z={20 - i}>
				<svelte:fragment slot="button" />
			</Dropdown>
		{/each}
	</div>
</div>
