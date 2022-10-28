<script lang="ts">
	import { getContext } from "svelte";
	import { fly } from "svelte/transition";

	import { getIcon } from "$lib/getIcon";
	import Pin from "$lib/components/icons/Pin.svelte";
	import DevTag from "$lib/components/DevTag.svelte";
	import Bulb from "$lib/components/icons/Bulb.svelte";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import DevSection from "$lib/components/DevSection.svelte";
	import GradientText from "$lib/components/GradientText.svelte";

	export let user: App.UserWithMetadata;

	const timestamp = getContext("timestamp") as string;
</script>

<a
	on:click
	in:fly={{ duration: 300, y: 50 }}
	href="/developers/{user.url}"
	rel="noreferrer noopener"
	class="bg-gray-500/40 flex flex-col gap-6 rounded-lg p-6 max-w-xl mx-auto shrink-0 w-full"
>
	<div class="flex flex-col gap-6 items-center md:flex-row">
		<div class="relative shrink-0">
			<img
				height="512"
				width="512"
				src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{user.id}/avatar?{timestamp}"
				alt="{user.name}'s avatar"
				loading="lazy"
				class="rounded-full bg-gray-400 w-20 h-20"
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
		<div
			class="flex flex-col-reverse gap-1 items-center text-center md:flex-col md:text-start md:items-start md:gap-0"
		>
			<GradientText class="from-green-light to-green-dark text-3xl">
				{user.name}
			</GradientText>
			<h1 class="font-semibold">{user.team || "No Team"}</h1>
		</div>
	</div>

	<p class="text-center md:text-lg md:text-start">
		{user.about}
	</p>

	<div class="flex flex-col gap-8 h-full">
		{#if user.pinnedProject && user.pinnedProject.visible}
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
					<img
						src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{user
							.pinnedProject.id}/banner?{timestamp}"
						width="1920"
						height="1080"
						loading="lazy"
						alt="Banner for '{user.pinnedProject.title}'"
						class="object-cover object-center bg-gray-400 w-full h-32 md:h-20 lg:w-24 lg:h-auto lg:rounded-lg"
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

		<DevSection title="Positions">
			<Bulb slot="icon" class="w-6 h-6" />

			{#each user.positions as position, i}
				{#if i <= 4}
					<DevTag name={position} />
				{/if}
			{/each}
		</DevSection>

		<DevSection title="Skills">
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
		</DevSection>
	</div>
</a>
