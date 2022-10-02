<script lang="ts">
	import { fly } from "svelte/transition";

	import { getIcon } from "$lib/getIcon";
	import Pin from "$lib/components/icons/Pin.svelte";
	import Bulb from "$lib/components/icons/Bulb.svelte";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import DevTag from "$lib/components/developers/index/DevTag.svelte";
	import DeveloperSection from "$lib/components/DeveloperSection.svelte";

	export let user: App.UserWithMetadata;
</script>

<a
	in:fly={{ duration: 300, y: 50 }}
	href="/developers/{user.url}"
	rel="noreferrer noopener"
	class="bg-gray-500/40 flex flex-col gap-6 rounded-lg p-6 max-w-xl mx-auto shrink-0 w-full"
>
	<!-- TODO: Replace placeholder -->

	<div class="flex gap-6 items-center">
		<div class="relative shrink-0">
			<img
				height="200"
				width="200"
				src="/assets/developers/user/placeholder/icon.webp"
				alt="{user.name}'s avatar"
				loading="lazy"
				class="rounded-full w-20 h-20"
			/>
			<div
				class="absolute bg-gray-500 -bottom-3 -right-2 rounded-full p-2"
			>
				<svelte:component
					this={getIcon(user.team || "")}
					class="w-5 h-5"
				/>
			</div>
		</div>
		<div>
			<GradientText
				class="from-green-light to-green-dark text-3xl mx-auto pt-4"
			>
				{user.name}
			</GradientText>
			<h1 class="font-semibold">{user.team || "No Team"}</h1>
		</div>
	</div>

	<p class="mx-auto md:text-lg">
		{user.about}
	</p>

	<div class="flex flex-col gap-8 h-full">
		{#if user.pinnedProject}
			<div class="mt-4">
				<div
					class="flex font-semibold justify-center items-center gap-2"
				>
					<Pin class="w-6 h-6" />
					<h1 class="text-lg">Pinned Project</h1>
				</div>

				<a
					href="/projects/{user.pinnedProject.url}"
					rel="noreferrer noopener"
					class="block rounded-lg border-t-4 overflow-hidden bg-gray-500/40 w-full mx-auto mt-4 lg:flex lg:p-4"
					style="border-color: #{user.pinnedProject.theme}"
				>
					<!-- TODO: Replace placeholders -->

					<img
						src="/assets/projects/project/placeholder/banner.webp"
						width="1920"
						height="1080"
						loading="lazy"
						alt="Banner for '{user.pinnedProject.title}'"
						class="object-cover object-center w-full h-32 md:h-20 lg:w-24 lg:h-auto lg:rounded-lg"
					/>

					<div
						class="flex flex-col py-4 px-3 min-h-[10rem] lg:min-h-[5rem] lg:py-1"
					>
						<h1 class="font-semibold text-2xl md:text-xl">
							{user.pinnedProject.title}
						</h1>
						<p class="mt-2 md:text-sm">
							{user.pinnedProject.description}
						</p>
					</div>
				</a>
			</div>
		{/if}

		<DeveloperSection title="Positions">
			<Bulb slot="icon" class="w-6 h-6" />

			{#each user.positions as position, i}
				{#if i <= 4}
					<DevTag name={position} />
				{/if}
			{/each}
		</DeveloperSection>

		<DeveloperSection title="Skills">
			<Wrench slot="icon" class="w-6 h-6" />

			{#each user.techSkills as skill, i}
				{#if i <= 2}
					<DevTag name={skill} />
				{/if}
			{/each}
			{#each user.softSkills as skill, i}
				{#if i <= 2}
					<DevTag name={skill} />
				{/if}
			{/each}
		</DeveloperSection>
	</div>
</a>
