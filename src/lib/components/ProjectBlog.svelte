<script lang="ts">
	import type { Project, Skill } from "@prisma/client";

	import Aws from "./icons/Aws.svelte";
	import React from "./icons/React.svelte";
	import Python from "./icons/Python.svelte";
	import Pytorch from "./icons/Pytorch.svelte";
	import JavaScript from "./icons/JavaScript.svelte";
	import TensorFlow from "./icons/TensorFlow.svelte";
	import GoogleCloud from "./icons/GoogleCloud.svelte";

	export let info: Project;

	// TODO: Make a better system for this
	const getSkillIcon = (name: Skill) => {
		switch (name) {
			case "JAVASCRIPT":
				return JavaScript;
			case "PYTHON":
				return Python;
			case "REACT":
				return React;
			case "TENSORFLOW":
				return TensorFlow;
			case "PYTORCH":
				return Pytorch;
			case "GCLOUD":
				return GoogleCloud;
			case "AWS":
				return Aws;
		}
	};
</script>

<a
	href={`projects/${info.id}`}
	class="rounded-lg border-t-4 border-solid max-w-xl mx-auto overflow-hidden bg-gray-500/40 border-[{info.theme}]"
>
	<div
		class="h-32 sm:h-44 bg-center bg-no-repeat bg-cover relative"
		style="background-image: url({info.bannerurl});"
	>
		<img
			width="200"
			height="200"
			src="/bernice.webp"
			alt="Bernice Lau from Team Tomorrow"
			class="absolute top-2 right-2 w-10 h-10 rounded-full border-2 border-[{info.theme}] sm:w-14 sm:h-14 sm:border-4 md:top-3 md:right-3"
		/>
	</div>
	<div class="py-4 px-3">
		<h1 class="font-semibold text-2xl">{info.title}</h1>
		<p class="mt-2">{info.snippet}</p>
		<div class="flex gap-2 mt-4">
			{#each info.skills as icon}
				<svelte:component this={getSkillIcon(icon)} class="w-8 h-8" />
			{/each}
		</div>
	</div>
</a>
