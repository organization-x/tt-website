<script lang="ts">
	import { generateHTML } from "@tiptap/html";
	import StarterKit from "@tiptap/starter-kit";

	import { techSkills } from "$lib/enums";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import Search from "$lib/components/icons/Search.svelte";
	import Input from "$lib/components/dashboard/Input.svelte";
	import TextBox from "$lib/components/dashboard/TextBox.svelte";
	import InputTitle from "$lib/components/dashboard/projects/project/InputTitle.svelte";
	import Collaborator from "$lib/components/dashboard/projects/project/Collaborator.svelte";

	import type { PageData } from "./$types";
	import type { JSONContent } from "@tiptap/core";
	import type { TechSkill } from "@prisma/client";

	export let data: PageData;

	const html = generateHTML(data.project.content as JSONContent, [
		StarterKit
	]);

	let { title, theme, snippet, skills } = data.project;

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

	// Skill dropdown selectors
	const onChange = ({
		detail
	}: CustomEvent<{ selected: string; previous: string }>) => {
		const index = skills.indexOf(detail.previous as TechSkill);

		// If the newly selected value is the same ignore
		if (skills[index] === detail.selected) return;

		// If there is a found value for that dropdown, and a selected value then update it, otherwise delete it.
		// If there isn't a found value for that dropdown then push it to the array.
		if (index !== -1) {
			detail.selected
				? (skills[index] = detail.selected as TechSkill)
				: skills.splice(index, 1);
		} else if (detail.selected) skills.push(detail.selected as TechSkill);

		skills = skills;

		console.log(skills);
	};

	// Input changes for title, snippet
	const onInput = (id: string, event: Event) => {
		const value = (event.target as HTMLInputElement).value;

		switch (id) {
			case "title":
				title = value;
			case "snippet":
				snippet = value;
		}
	};
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
	<Input
		on:input={(e) => onInput("title", e)}
		placeholder="Name your project..."
		value={title}
	>
		<InputTitle slot="label">Title</InputTitle>
	</Input>

	<TextBox
		on:input={(e) => onInput("snippet", e)}
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
			<Dropdown
				{i}
				z={20 - i}
				radio={true}
				required={i < 2}
				options={techSkills}
				selectedItems={skills}
				on:change={onChange}
			/>
		{/each}
	</div>
</div>
