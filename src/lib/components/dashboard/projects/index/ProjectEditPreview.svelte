<script lang="ts">
	import { fly, slide } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	import { getIcon } from "$lib/getIcon";
	import { debounce } from "$lib/debounce";
	import Pin from "$lib/components/icons/Pin.svelte";
	import Trash from "$lib/components/icons/Trash.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import ShowHide from "$lib/components/icons/ShowHide.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";
	import ExternalLink from "$lib/components/icons/ExternalLink.svelte";

	import type { User } from "@prisma/client";

	const dispatch = createEventDispatcher<{
		visible: undefined;
		pinned: undefined;
		delete: undefined;
	}>();

	export let user: User;
	export let project: App.ProjectWithAuthors;

	let open = false;
	let deleting = false;
	let innerWidth: number;

	// Store the toggleable variables seperatley since svelte treats object as one whole
	// change instead of listening to each property
	let pinned = project.pinned;
	let visible = project.visible;

	$: project.visible = visible;
	$: project.pinned = pinned;

	// To prevent debounce from firing twice if the mobile actions menu is open, close it at a breakpoint
	$: if (innerWidth >= 600) open = false;
</script>

<svelte:window bind:innerWidth />

<div
	out:slide={{ duration: deleting ? 500 : 0 }}
	in:fly={{ duration: 300, y: 50 }}
	disabled={deleting}
	class:opacity-70={deleting}
	class="mb-10 transition-opacity"
>
	<div
		class="rounded-lg border-t-4 overflow-hidden relative bg-gray-900 w-full shadow-black/30 shadow-lg z-20"
		style="border-color: #{project.theme}"
	>
		<div class="relative">
			<!-- TODO: Replace placeholders -->

			<img
				src="/assets/projects/project/placeholder/banner.webp"
				width="1920"
				height="1080"
				alt="Banner for '{project.title}'"
				class="object-cover object-center w-full h-32 row-start-1 col-start-1"
			/>

			{#each project.authors as author}
				{#if author.id !== user.id}
					<img
						width="200"
						height="200"
						src="/assets/developers/user/placeholder/icon.webp"
						alt="{author.name}'s avatar"
						class="absolute top-2 right-2 w-10 h-10 rounded-full border-2 sm:w-14 sm:h-14 sm:border-4 md:top-3 md:right-3"
						style="border-color: #{project.theme}"
					/>
				{/if}
			{/each}
		</div>

		<div class="flex flex-col py-4 px-3 min-h-72 lg:px-5">
			<div class="flex items-center gap-2">
				<h1 class="font-semibold text-2xl">{project.title}</h1>
				<a
					href="/projects/{project.url}"
					target="_blank"
					rel="noopener noreferrer"
				>
					<ExternalLink class="w-6 h-6" />
				</a>
			</div>
			<p class="mt-2">{project.description}</p>
			<div class="flex gap-2 mt-auto pt-4 md:items-center md:px-1">
				{#each project.skills as icon}
					<svelte:component this={getIcon(icon)} class="w-8 h-8" />
				{/each}
				<button
					on:click={() => (open = !open)}
					class="ml-auto md:hidden"
				>
					<DropArrow {open} class="w-8 h-8" />
				</button>

				<div
					class="hidden md:flex md:gap-5 md:justify-center md:ml-auto"
				>
					<button
						on:click={() => (visible = !visible)}
						use:debounce={{
							bind: visible,
							func: () => {
								dispatch("visible");
							},
							delay: 300
						}}
						class="bg-gray-500/40 shrink-0 rounded-lg p-3"
					>
						<ShowHide class="w-5 h-5" crossed={visible} />
					</button>
					<button
						on:click={() => (pinned = !pinned)}
						use:debounce={{
							bind: pinned,
							func: () => {
								dispatch("pinned");
							},
							delay: 300
						}}
						class="shrink-0 rounded-lg p-3 {pinned
							? 'bg-blue-light'
							: 'bg-gray-500/40'}"
					>
						<Pin class="w-5 h-5" />
					</button>
					<a
						href="/dashboard/projects/{project.url}"
						rel="noreferrer noopener"
						class="bg-blue-light p-3 rounded-lg shrink-0"
					>
						<Pencil class="w-5 h-5" />
					</a>
					<button
						on:click={() => {
							deleting = true;
							dispatch("delete");
						}}
						class="bg-red-light shrink-0 rounded-lg p-3"
					>
						<Trash class="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	</div>

	{#if open}
		<div
			transition:slide|local={{ duration: 200 }}
			class="flex justify-center px-3 gap-5 bg-gray-900 pb-4 pt-8 rounded-b-lg -mt-2 relative z-10 md:hidden"
		>
			<button
				on:click={() => (visible = !visible)}
				use:debounce={{
					bind: visible,
					func: () => {
						dispatch("visible");
					},
					delay: 300
				}}
				class="bg-gray-500/40 shrink-0 rounded-lg p-3 w-fit"
			>
				<ShowHide class="w-5 h-5" crossed={visible} />
			</button>
			<button
				on:click={() => (pinned = !pinned)}
				use:debounce={{
					bind: pinned,
					func: () => {
						dispatch("pinned");
					},
					delay: 300
				}}
				class="shrink-0 rounded-lg p-3 w-fit {pinned
					? 'bg-blue-light'
					: 'bg-gray-500/40'}"
			>
				<Pin class="w-5 h-5" />
			</button>
			<button
				on:click={() => {
					deleting = true;
					dispatch("delete");
				}}
				class="bg-red-light shrink-0 rounded-lg p-3 w-fit"
			>
				<Trash class="w-5 h-5" />
			</button>
			<a
				href="/dashboard/projects/{project.url}"
				rel="noreferrer noopener"
				class="bg-blue-light p-3 rounded-lg shrink-0 w-fit"
			>
				<Pencil class="w-5 h-5" />
			</a>
		</div>
	{/if}
</div>
