<script lang="ts">
	import { getIcon } from "$lib/components/icons/getIcon";

	import DevTag from "./DevTag.svelte";
	import DevList from "./DevList.svelte";
	import Button from "../../Button.svelte";
	import Bulb from "../../icons/Bulb.svelte";
	import Wrench from "../../icons/Wrench.svelte";
	import GradientText from "../../GradientText.svelte";

	import type { User } from "@prisma/client";

	export let user: User;

	const { name, url, team, positions, softSkills, techSkills } = user;
</script>

<div
	class="bg-gray-500/40 rounded-lg w-full h-full snap-center py-6 px-4 max-w-xl mx-auto shrink-0"
>
	<div class="flex items-center gap-4">
		<img
			height="200"
			width="200"
			src="/developers/user/{url}/icon.webp"
			alt="{name}'s avatar"
			loading="lazy"
			class="rounded-full my-auto w-20"
		/>
		<div>
			<h1 class="font-bold">
				{team ? team.toUpperCase() : "UNKNOWN"}
			</h1>
			<GradientText class="from-green-light to-green-dark text-3xl">
				{name}
			</GradientText>
		</div>
	</div>
	<p class="mt-4">
		<slot />
	</p>
	<DevList title="Positions" icon={Bulb}>
		{#each positions as position}
			<DevTag name={position} icon={getIcon(position)} />
		{/each}
	</DevList>
	<DevList title="Skills" icon={Wrench}>
		{#each techSkills as skill}
			<DevTag name={skill} icon={getIcon(skill)} />
		{/each}
	</DevList>
	<Button href="/developers/{url}" class="mt-8 mx-auto">View Profile</Button>
</div>
