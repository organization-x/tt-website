<script lang="ts">
	export let name: string;
	export let description: string;
	export let href: string;
	export let img: string;
	export let developers: App.Developer[];
	export let skills: string[];

	import { getIcon } from "$lib/components/icons/getIcon";
</script>

<a
	class="block bg-gray-500/40 rounded border-t-4 border-t-pink-dark hover:bg-gray-500/50 transition-colors"
	{href}
>
	<div class="relative isolate h-20">
		<img
			src={img}
			alt={name}
			class="absolute inset-0 object-cover w-full h-full -z-10"
		/>

		<div class="absolute z-10 flex flex-row-reverse top-2 right-2">
			{#each developers as developer}
				<img
					src="https://avatars.githubusercontent.com/u/251288?v=4"
					alt={developer.name}
					class="w-10 h-10 rounded-full border-2 border-pink-dark -ml-4"
				/>
			{/each}
		</div>
	</div>

	<div class="p-4 flex flex-col gap-1">
		<h2 class="font-semibold text-lg lg:text-xl">{name}</h2>

		<p class="w-full overflow-hidden text-sm">
			{description}
		</p>

		<div class="flex gap-2 mt-2">
			{#each skills as skill}
				<div class="relative flex gap-1 items-center">
					<svelte:component
						this={getIcon(skill)}
						class="w-6 h-6 shrink-0"
					/>
				</div>
			{/each}
		</div>
	</div>
</a>
