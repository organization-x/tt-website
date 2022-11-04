<script lang="ts">
	import "$lib/hljsTheme.css";

	import hljs from "highlight.js/lib/core";
	import { generateHTML } from "@tiptap/html";
	import { onMount, getContext } from "svelte";
	import c from "highlight.js/lib/languages/c";
	import go from "highlight.js/lib/languages/go";
	import css from "highlight.js/lib/languages/css";
	import xml from "highlight.js/lib/languages/xml";
	import cpp from "highlight.js/lib/languages/cpp";
	import sql from "highlight.js/lib/languages/sql";
	import php from "highlight.js/lib/languages/php";
	import java from "highlight.js/lib/languages/java";
	import json from "highlight.js/lib/languages/json";
	import bash from "highlight.js/lib/languages/bash";
	import rust from "highlight.js/lib/languages/rust";
	import perl from "highlight.js/lib/languages/perl";
	import ruby from "highlight.js/lib/languages/ruby";
	import yaml from "highlight.js/lib/languages/yaml";
	import swift from "highlight.js/lib/languages/swift";
	import python from "highlight.js/lib/languages/python";
	import kotlin from "highlight.js/lib/languages/kotlin";
	import csharp from "highlight.js/lib/languages/csharp";
	import graphql from "highlight.js/lib/languages/graphql";
	import markdown from "highlight.js/lib/languages/markdown";
	import typescript from "highlight.js/lib/languages/typescript";
	import javascript from "highlight.js/lib/languages/javascript";

	import { getIcon } from "$lib/getIcon";
	import { extensions } from "$lib/tiptapExtensions";
	import Button from "$lib/components/Button.svelte";
	import Author from "$lib/components/Author.svelte";
	import Seperator from "$lib/components/Seperator.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";

	import type { PageData } from "./$types";
	import type { JSONContent } from "@tiptap/core";

	export let data: PageData;

	const timestamp = getContext("timestamp") as string;
	const html = generateHTML(data.content as JSONContent, extensions);

	// Register all the HLJS languages
	hljs.registerLanguage("c", c);
	hljs.registerLanguage("go", go);
	hljs.registerLanguage("css", css);
	hljs.registerLanguage("sql", sql);
	hljs.registerLanguage("php", php);
	hljs.registerLanguage("cpp", cpp);
	hljs.registerLanguage("xml", xml);
	hljs.registerLanguage("html", xml);
	hljs.registerLanguage("json", json);
	hljs.registerLanguage("bash", bash);
	hljs.registerLanguage("rust", rust);
	hljs.registerLanguage("perl", perl);
	hljs.registerLanguage("ruby", ruby);
	hljs.registerLanguage("java", java);
	hljs.registerLanguage("yaml", yaml);
	hljs.registerLanguage("swift", swift);
	hljs.registerLanguage("python", python);
	hljs.registerLanguage("kotlin", kotlin);
	hljs.registerLanguage("csharp", csharp);
	hljs.registerLanguage("graphql", graphql);
	hljs.registerLanguage("markdown", markdown);
	hljs.registerLanguage("typescript", typescript);
	hljs.registerLanguage("javascript", javascript);

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
	<title>{data.title} / Team Tomorrow</title>
</svelte:head>

<img
	src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{data.id}/banner?{timestamp}"
	width="1920"
	height="1080"
	alt="Banner for '{data.title}'"
	class="object-cover object-center bg-gray-400 w-full h-32 border-b-4 lg:h-44 lg:border-b-8"
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
