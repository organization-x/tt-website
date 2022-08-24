<script lang="ts">
	import type { Project } from "./types";

	import Aws from "./icons/Aws.svelte";
	import Python from "./icons/Python.svelte";
	import React from "./icons/React.svelte";
	import GoogleCloud from "./icons/GoogleCloud.svelte";
	import JavaScript from "./icons/JavaScript.svelte";
	import Pytorch from "./icons/Pytorch.svelte";
	import TensorFlow from "./icons/TensorFlow.svelte";

	export let info: Project;

	// TODO: Make a better system this is goofy
	const getIcon = (name: string) => {
		switch (name) {
			case "react":
				return React;
			case "python":
				return Python;
			case "aws":
				return Aws;
			case "gcloud":
				return GoogleCloud;
			case "js":
				return JavaScript;
			case "pytorch":
				return Pytorch;
			case "tensorflow":
				return TensorFlow;
		}
	};
</script>

<a
	href={info.href}
	class="rounded-lg border-t-4 border-solid max-w-xl mx-auto overflow-hidden bg-gray-500/40 border-[{info.color}]"
>
	<div
		class="h-20 sm:h-44 bg-center bg-no-repeat bg-cover"
		style="background-image: url({info.src});"
	/>
	<div class="py-4 px-3">
		<h1 class="font-semibold text-2xl">{info.name}</h1>
		<p class="mt-2">{info.desc}</p>
		<div class="flex gap-2 mt-4">
			{#each info.icons as icon}
				<svelte:component this={getIcon(icon)} class="w-8 h-8" />
			{/each}
		</div>
	</div>
</a>
