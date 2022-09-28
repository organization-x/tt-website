<script lang="ts">
	import { getIcon } from "$lib/getIcon";

	import Button from "$lib/components/Button.svelte";
	import Bulb from "$lib/components/icons/Bulb.svelte";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import DevTag from "$lib/components/developers/index/DevTag.svelte";
	import DevList from "$lib/components/developers/index/DevList.svelte";

	import type { User } from "@prisma/client";

	export let user: User;
</script>

<a
	href="/developers/{user.url}"
	rel="noreferrer noopener"
	class="bg-gray-500/40 flex flex-col rounded-lg w-full snap-center py-6 px-4 max-w-xl mx-auto shrink-0 h-[55rem]"
>
	<div class="flex items-center justify-center gap-4 mb-4">
		<!-- TODO: Replace placeholder -->

		<img
			height="200"
			width="200"
			src="/assets/developers/user/placeholder/icon.webp"
			alt="{user.name}'s avatar"
			loading="lazy"
			class="rounded-full w-20"
		/>
		<div>
			<h1 class="font-semibold">
				{user.team ? user.team.toUpperCase() : "UNKNOWN"}
			</h1>
			<GradientText class="from-green-light to-green-dark text-3xl">
				{user.name}
			</GradientText>
		</div>
	</div>

	<p class="text-center my-auto">{user.about}</p>

	<div>
		<DevList title="Positions" icon={Bulb}>
			{#each user.positions as position, i}
				{#if i <= 4}
					<DevTag name={position} icon={getIcon(position)} />
				{/if}
			{/each}
		</DevList>

		<DevList title="Skills" icon={Wrench}>
			{#each user.techSkills as skill, i}
				{#if i <= 2}
					<DevTag name={skill} icon={getIcon(skill)} />
				{/if}
			{/each}
			{#each user.softSkills as skill, i}
				{#if i <= 2}
					<DevTag name={skill} icon={getIcon(skill)} />
				{/if}
			{/each}
		</DevList>
	</div>
</a>
