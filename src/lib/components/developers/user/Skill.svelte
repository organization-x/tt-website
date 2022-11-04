<script lang="ts">
	import { slide } from "svelte/transition";
	import { createEventDispatcher, getContext, onMount } from "svelte";

	import { getIcon } from "$lib/getIcon";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import Plus from "$lib/components/icons/general/Plus.svelte";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";

	import type { SoftSkill, TechSkill } from "@prisma/client";

	const dispatch = createEventDispatcher<{
		endorsement: {
			skill: TechSkill | SoftSkill;
			endorsing: boolean;
		};
	}>();

	export let endorsing: boolean;
	export let endorser: string | null;
	export let name: TechSkill | SoftSkill;
	export let endorsements: { id: number; from: App.Endorser }[];

	let open = false;
	let innerWidth: number;

	const timestamp = getContext("timestamp");

	// Create a message based on how many endorsements there are
	$: message = endorsements.length
		? `This skill is verified by ${endorsements.length} other pro${
				endorsements.length > 1 ? "s" : ""
		  }`
		: "";

	// Detect whether the current user has endorsed this skill
	$: isEndorsed = endorsements.some(({ from }) => from.id === endorser);

	// Don't keep the skill open before/after endorsing a skill
	$: if (endorsing) open = false;

	onMount(() => (innerWidth = window.innerWidth));
</script>

<svelte:window on:resize={() => (innerWidth = window.innerWidth)} />

<div
	class:bg-gray-800={!endorsements.length}
	class:bg-blue-light={endorsements.length > 0 && endorsements.length <= 3}
	class:bg-teal-dark={3 < endorsements.length && endorsements.length <= 10}
	class:bg-green-light={endorsements.length > 10}
	class="rounded-lg overflow-hidden transition-colors duration-200 md:flex lg:max-w-[26rem]"
>
	<div
		class="flex shrink-0 transition-widpad duration-200 {endorsements.length
			? 'md:w-1/2'
			: 'md:w-full'}"
	>
		<button
			on:click={() =>
				innerWidth < 600 && endorsements.length && (open = !open)}
			class:border-transparent={!endorsements.length}
			class:border-blue-light={endorsements.length > 0 &&
				endorsements.length <= 3}
			class:border-teal-dark={3 < endorsements.length &&
				endorsements.length <= 10}
			class:border-green-light={endorsements.length > 10}
			class="flex w-full items-center gap-2 transition-[border,padding] justify-center font-semibold bg-gray-800 rounded-lg duration-200 border-4 py-4 px-3 overflow-hidden md:justify-center md:cursor-auto"
		>
			<div
				class:ml-12={!endorsements.length && endorser}
				class="flex items-center gap-4 transition-[margin]"
			>
				<svelte:component
					this={getIcon(name)}
					class="w-7 h-7 shrink-0"
				/>

				<h1 class="text-sm">{name.replaceAll("_", " ")}</h1>
			</div>

			<DropArrow
				{open}
				class="transition-[transform,width] h-7 md:hidden {endorsements.length
					? 'w-7'
					: 'w-0'}"
			/>
		</button>

		{#if endorser}
			<button
				on:click={() =>
					dispatch("endorsement", {
						skill: name,
						endorsing: !isEndorsed
					})}
				disabled={endorsing}
				class:border-transparent={!endorsements.length}
				class:border-blue-light={endorsements.length > 0 &&
					endorsements.length <= 3}
				class:border-teal-dark={3 < endorsements.length &&
					endorsements.length <= 10}
				class:border-green-light={endorsements.length > 10}
				class="rounded-lg bg-gray-800 shrink-0 p-4 border-4 transition-border duration-200"
			>
				<Plus
					class="w-7 h-7 transition-[opacity,transform] {endorsing
						? ' opacity-70'
						: ''}{isEndorsed ? ' rotate-45' : ''}"
				/>
			</button>
		{/if}
	</div>

	{#if (open && endorsements.length) || innerWidth >= 600}
		<div
			transition:slide={{ duration: innerWidth < 600 ? 200 : 0 }}
			class:m-2={innerWidth < 600}
			class:mx-2={innerWidth >= 600 && endorsements.length}
			class="md:flex md:items-center md:transition-[width,margin] md:duration-200 {endorsements.length
				? 'md:w-1/2'
				: 'md:w-0'}"
		>
			<h1 class="text-sm text-center mb-1 font-semibold md:hidden">
				{message}
			</h1>

			<Scrollable
				class="transition-opacity {!endorsements.length
					? 'before:from-red-light after:to-red-light'
					: endorsements.length <= 3
					? 'before:from-blue-light after:to-blue-light'
					: endorsements.length <= 10
					? 'before:from-teal-dark after:to-teal-dark'
					: 'before:from-green-light after:to-green-light'}{endorsing
					? ' opacity-0'
					: ''}"
			>
				<h1
					class:md:mx-auto={!endorsements.length}
					class:md:max-w-[8rem]={endorsements.length}
					class="hidden md:block md:text-sm md:font-semibold md:text-center md:shrink-0"
				>
					{message}
				</h1>

				{#each endorsements as endorsement (endorsement.from.id)}
					<a
						href="/developers/{endorsement.from.url}"
						target="_blank"
						rel="noreferrer noopener"
						class="shrink-0"
					>
						<img
							width="512"
							height="512"
							src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{endorsement
								.from.id}/avatar?{timestamp}"
							alt="{endorsement.from.name}'s avatar"
							class="w-10 h-10 rounded-full"
						/>
					</a>
				{/each}
			</Scrollable>
		</div>
	{/if}
</div>
