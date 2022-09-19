<script lang="ts">
	import "$lib/hljsTheme.css";

	import HLJS from "highlight.js";
	import { generateHTML } from "@tiptap/html";

	import { onMount } from "svelte";
	import { getIcon } from "$lib/getIcon";
	import { extensions } from "$lib/tiptapExtensions";
	import Button from "$lib/components/Button.svelte";
	import ProjectDev from "$lib/components/ProjectDev.svelte";

	import type { PageData } from "./$types";
	import type { JSONContent } from "@tiptap/core";

	export let data: PageData;

	const html = generateHTML(data.project.content as JSONContent, extensions);

	const { title, theme, date, skills } = data.project;

	// Syntax highlighting
	onMount(HLJS.highlightAll);
</script>

<div
	class="h-32 bg-cover bg-center border-b-4"
	style="
    border-color: #{theme};
    background-image: url(/projects/project/placeholder/banner.webp);
    "
/>

<div class="p-4 max-w-screen-lg mx-auto">
	<div class="flex justify-between items-center">
		<p>{date.toLocaleDateString("en-US")}</p>
		<div class="flex gap-2">
			{#each skills as skill}
				<svelte:component this={getIcon(skill)} class="w-8 h-8" />
			{/each}
		</div>
	</div>
	<h1 class="font-bold text-3xl mt-3" style="color: #{theme}">{title}</h1>
	<!-- TODO: Switch to using actual profile pictures/banners -->
	{#if data.authors.length > 2}
		<div
			class="bg-gray-800 rounded-lg drop-shadow-lg mt-4 relative mx-auto
            before:z-10 before:absolute before:rounded-l-lg before:top-0 before:left-0 before:w-8 before:h-full before:bg-gradient-to-r before:from-gray-800 before:to-transparent before:pointer-events-none
            
            after:z-10 after:absolute after:rounded-r-lg after:top-0 after:right-0 after:w-8 after:h-full after:bg-gradient-to-r after:from-transparent after:to-gray-800 after:pointer-events-none"
		>
			<div
				class="flex overflow-auto py-2 px-4 gap-8 snap-x snap-proximity rounded-lg scrollbar-hidden"
			>
				{#each data.authors as author}
					<ProjectDev
						{theme}
						user={{
							name: author.name,
							position: author.position,
							url: "placeholder"
						}}
					/>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex gap-4">
			{#each data.authors as author}
				<a
					href="/developers/{author.url}"
					class="flex mt-4 items-center gap-3 w-fit"
				>
					<img
						width="200"
						height="200"
						alt="{author.name}'s avatar"
						src="/developers/user/placeholder/icon.webp"
						class="w-12 h-12 rounded-full border-4"
						style="border-color: #{theme}"
					/>
					<h1 class="font-semibold">{author.name}</h1>
				</a>
			{/each}
		</div>
	{/if}

	<div class="my-12 [&>p:empty]:h-6">
		{@html html}
	</div>

	<Button href={data.previous}>More projects</Button>
</div>
