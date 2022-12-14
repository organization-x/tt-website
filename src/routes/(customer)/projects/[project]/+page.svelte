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
	import { breadcrumb, article } from "$lib/seo";
	import { extensions } from "$lib/tiptapExtensions";
	import Button from "$lib/components/Button.svelte";
	import Author from "$lib/components/Author.svelte";
	import Separator from "$lib/components/Separator.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import Scrollable from "$lib/components/Scrollable.svelte";

	import type { PageData } from "./$types";
	import { generateText, type JSONContent } from "@tiptap/core";

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

	<meta name="description" content={data.description} />

	<!-- OpenGraph data with user info -->
	<meta property="og:title" content="{data.title} / Team Tomorrow" />
	<meta name="og:description" content={data.description} />
	<meta
		name="og:image"
		src="{PUBLIC_CLOUDFLARE_URL}/banner-{data.id}/banner"
	/>
	<meta
		name="og:image:secure_url"
		content="{PUBLIC_CLOUDFLARE_URL}/banner-{data.id}/banner"
	/>
	<meta name="og:image:width" content="512" />
	<meta name="og:image:height" content="512" />
	<meta name="og:image:alt" content="Banner for '{data.title}'" />

	<!-- Twitter card data with user info -->
	<meta property="twitter:title" content="{data.title} / Team Tomorrow" />
	<meta name="twitter:description" content={data.description} />
	<meta
		name="twitter:image"
		src="{PUBLIC_CLOUDFLARE_URL}/banner-{data.id}/banner"
	/>

	{@html breadcrumb(data.title, data.url, "projects")}
	{@html article(
		data.title,
		data.description,
		data.url,
		data.id,
		// Typing isn't supported in Svelte HTML
		// @ts-ignore
		data.authors.find(({ user }) => user.id === data.ownerId).user.name,
		data.date.toISOString(),
		data.skills.join(", "),
		// @ts-ignore
		generateText(data.content, extensions)
	)}
</svelte:head>

<img
	src="{PUBLIC_CLOUDFLARE_URL}/banner-{data.id}/banner?{timestamp}"
	width="1920"
	height="1080"
	alt="Banner for '{data.title}'"
	class="object-cover object-center bg-gray-400 w-full h-32 border-b-4 lg:h-44 lg:border-b-8"
	style="border-color: #{data.theme}"
/>

<div class="flex flex-col gap-6 p-4 max-w-2xl mx-auto lg:max-w-3xl">
	<div class="flex justify-between items-center">
		<p>{data.date.toLocaleDateString("en-US")}</p>
		<div class="flex gap-2">
			{#each data.skills as skill}
				<svelte:component
					this={getIcon(skill)}
					class="w-6 h-6 lg:w-7 lg:h-7"
				/>
			{/each}
		</div>
	</div>

	<h1 class="font-bold text-3xl break-words">
		{data.title}
	</h1>

	<p>
		{data.description}
	</p>

	<Scrollable class="before:from-black after:to-black" innerClass="gap-7">
		{#each data.authors as author}
			<Author theme={data.theme} {author} />
		{/each}
	</Scrollable>

	<Separator class="-mt-4 mb-4" />

	<div class="mb-12 [&>p:empty]:h-6">
		{@html html}
	</div>

	<Button href="/projects">More projects</Button>
</div>
