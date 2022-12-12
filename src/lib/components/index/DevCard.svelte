<script lang="ts">
	import { getContext } from "svelte";

	import { getIcon } from "$lib/getIcon";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import GradientText from "$lib/components/GradientText.svelte";

	export let developer: App.Developer;

	const timestamp = getContext("timestamp") as string;
</script>

<div
	class="bg-gray-800 p-4 py-8 snap-center shrink-0 mx-auto w-full rounded-lg text-center md:text-start md:p-6 lg:p-8"
>
	<div
		class="flex flex-col gap-6 items-center md:flex-row md:gap-4 lg:max-w-md lg:mx-auto"
	>
		<div class="relative w-fit mx-auto md:shrink-0 lg:mx-0">
			<img
				height="512"
				width="512"
				src="{PUBLIC_CLOUDFLARE_URL}/avatar-{developer.id}/avatar?{timestamp}"
				alt="{developer.name}'s avatar"
				loading="lazy"
				class="rounded-full bg-gray-400 w-20 h-20 object-cover object-center"
			/>

			<div
				class="absolute bg-gray-500 -bottom-2.5 -right-2.5 rounded-full p-2.5"
			>
				<svelte:component
					this={getIcon(developer.team || "")}
					class="w-4 h-4"
				/>
			</div>
		</div>

		<div
			class="flex flex-col gap-1 w-full overflow-hidden md:flex-col-reverse"
		>
			<h1 class="font-semibold">
				{developer.team || "No Team"}
			</h1>

			<GradientText class="from-green-light to-green-dark text-2xl">
				{developer.name}
			</GradientText>
		</div>
	</div>

	<p class="mt-6 mb-10 mx-auto max-w-xs md:max-w-none lg:my-8 lg:max-w-md">
		{developer.about}
	</p>

	<div
		class="grid grid-cols-2 gap-x-8 gap-y-6 px-4 md:px-14 lg:flex lg:justify-center lg:items-center lg:gap-6"
	>
		{#each [...developer.techSkills.slice(0, 2), ...developer.softSkills.slice(0, 2)] as skill}
			<div class="flex justify-center items-center font-semibold gap-3">
				<svelte:component
					this={getIcon(skill)}
					class="w-6 h-6 shrink-0"
				/>

				<h1 class="text-sm">
					{skill.replaceAll("_", " ")}
				</h1>
			</div>
		{/each}
	</div>
</div>
