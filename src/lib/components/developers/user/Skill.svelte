<script lang="ts">
	import { slide } from "svelte/transition";
	import { createEventDispatcher, getContext, onMount } from "svelte";

	import { getIcon } from "$lib/getIcon";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
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
	class:bg-gray-700={!endorsements.length}
	class:bg-blue-light={endorsements.length > 0 && endorsements.length <= 3}
	class:bg-teal-dark={3 < endorsements.length && endorsements.length <= 10}
	class:bg-green-light={endorsements.length > 10}
	class="rounded-lg overflow-hidden transition-colors duration-200 md:flex lg:max-w-[26rem]"
>
	<div
		class="flex shrink-0 transition-transform duration-200 {endorsements.length
			? 'md:w-1/2'
			: 'md:w-full'}"
	>
		<button
			on:click={() =>
				innerWidth < 600 && endorsements.length && (open = !open)}
			class:justify-between={endorser}
			class:justify-center={!endorser}
			class:cursor-auto={!endorsements.length}
			class:border-transparent={!endorsements.length}
			class:border-blue-light={endorsements.length > 0 &&
				endorsements.length <= 3}
			class:border-teal-dark={3 < endorsements.length &&
				endorsements.length <= 10}
			class:border-green-light={endorsements.length > 10}
			class="flex w-full select-text items-center transition-[border,padding] font-semibold bg-gray-700 rounded-lg duration-200 border-4 p-4 overflow-hidden md:justify-center md:cursor-auto"
		>
			<div
				class:md:ml-12={!isEndorsed && endorser}
				class="flex items-center gap-4 transition-transform md:ml-12"
			>
				<svelte:component
					this={getIcon(name)}
					class="w-6 h-6 shrink-0"
				/>

				<h1 class="text-sm">{name.replaceAll("_", " ")}</h1>
			</div>

			<DropArrow
				{open}
				class="transition-transform transition-tr h-3 md:hidden {endorsements.length
					? 'w-3'
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
				class="rounded-lg bg-gray-700 shrink-0 py-4 px-5 border-4 transition-border duration-200"
			>
				<Plus
					class="w-4 h-4 transition-transpacity {endorsing
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
			class="md:flex md:items-center md:transition-transform md:duration-200 {endorsements.length
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

				{#each endorsements as { from } (from.id)}
					<a
						href="/developers/{from.url}"
						target="_blank"
						rel="noreferrer noopener"
						class="shrink-0"
					>
						<img
							width="512"
							height="512"
							src="{PUBLIC_CLOUDFLARE_URL}/avatar-{from.id}/avatar?{timestamp}"
							alt="{from.name}'s avatar"
							class="w-10 h-10 object-cover object-center rounded-full"
						/>
					</a>
				{/each}
			</Scrollable>
		</div>
	{/if}
</div>
