<script lang="ts">
	import "$lib/hljsTheme.css";

	import { onMount } from "svelte";
	import hljs from "highlight.js/es/core";
	import { generateHTML } from "@tiptap/html";

	import { getIcon } from "$lib/getIcon";
	import { extensions } from "$lib/tiptapExtensions";
	import Button from "$lib/components/Button.svelte";
	import Author from "$lib/components/Author.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";

	import type { PageData } from "./$types";
	import type { JSONContent } from "@tiptap/core";

	export let data: PageData;

	const html = generateHTML(data.content as JSONContent, extensions);

	onMount(async () => {
		// Syntax highlighting
		hljs.highlightAll();

		if (!data.track) return;

		import("$lib/analytics")
			.then(async ({ analytics }) =>
				analytics.track("project_view", {
					id: data.id
				})
			)
			.catch(() => {});
	});
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<!-- TODO: Replace Cloudflare image delivery URL -->

<img
	src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{data.id}/banner"
	width="1920"
	height="1080"
	alt="Banner for '{data.title}'"
	class="object-cover object-center w-full h-32 border-b-4 lg:h-44 lg:border-b-8"
	style="border-color: #{data.theme}"
/>

<div class="p-4 max-w-2xl mx-auto lg:max-w-3xl">
	<div class="flex justify-between items-center">
		<p>{data.date.toLocaleDateString("en-US")}</p>
		<div class="flex gap-2">
			{#each data.skills as skill}
				<svelte:component this={getIcon(skill)} class="w-8 h-8" />
			{/each}
		</div>
	</div>

	<h1 class="font-bold text-3xl my-6" style="color: #{data.theme}">
		{data.title}
	</h1>

	<Scrollable class="before:from-black after:to-black">
		{#each data.authors as author}
			<Author theme={data.theme} {author} />
		{/each}
	</Scrollable>

	<Seperator class="mt-4 mb-10" />

	<div class="mb-12 [&>p:empty]:h-6">
		{@html html}
	</div>

	<Button href="/projects">More projects</Button>
</div>
