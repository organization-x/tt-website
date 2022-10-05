<script lang="ts">
	import { fly, slide } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	import { user } from "$lib/stores";
	import { getIcon } from "$lib/getIcon";
	import Pin from "$lib/components/icons/Pin.svelte";
	import Trash from "$lib/components/icons/Trash.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import ShowHide from "$lib/components/icons/ShowHide.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";
	import DashLink from "$lib/components/dashboard/DashLink.svelte";
	import ExternalLink from "$lib/components/icons/ExternalLink.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";

	const dispatch = createEventDispatcher<{
		pinned: undefined;
		delete: undefined;
	}>();

	export let pinnedProject: string | null;
	export let project: App.ProjectWithMetadata;

	// Disable a few buttons that should only be used on the project management page
	export let minified: boolean = false;

	// Keep track whether this the user is an owner or a collaborator
	const isOwner = $user.id === project.ownerId;

	let open = false;
	let deleting = false;
	let innerWidth: number;

	// Store the toggleable variables seperatley since svelte treats object as one whole
	// change instead of listening to each property
	let visible = project.visible;

	// To prevent debounce from firing twice if the mobile actions menu is open, close it at a breakpoint
	$: if (innerWidth >= 600) open = false;

	const toggleVisible = () => {
		fetch("/api/project", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					id: project.id
				},
				project: {
					visible
				}
			} as App.ProjectUpdateRequest)
		}).then(() => (project.visible = visible));
	};
</script>

<svelte:window bind:innerWidth />

<div
	on:outroend
	out:slide={{ duration: deleting ? 500 : 0 }}
	in:fly={{ duration: 300, y: 50 }}
	disabled={deleting}
	class:mb-10={!minified}
	class:opacity-70={deleting}
	class:pointer-events-none={deleting}
	class="transition-opacity"
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

			<div
				class="absolute top-2 right-2 left-0 justify-end pr-6 flex sm:pr-8 md:top-3 md:right-3"
			>
				{#each project.authors as author, i}
					{#if author.user.id !== $user.id && i <= 4}
						<img
							width="200"
							height="200"
							src="/assets/developers/user/placeholder/icon.webp"
							alt="{author.user.name}'s avatar"
							class="w-10 h-10 -mr-6 sm:-mr-8 rounded-full border-2 sm:w-14 sm:h-14 sm:border-4"
							style="border-color: #{project.theme}; z-index: {project
								.authors.length - i}"
						/>
					{/if}
				{/each}
			</div>
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
					{#if isOwner}
						<DashButton
							icon={true}
							on:click={() => (visible = !visible)}
							debounce={{
								bind: visible,
								func: toggleVisible,
								delay: 300
							}}
							class="bg-gray-500/40 shrink-0 rounded-lg p-3 hover:bg-gray-500/20"
						>
							<ShowHide class="w-5 h-5" crossed={visible} />
						</DashButton>

						<DashButton
							icon={true}
							on:click={() => {
								pinnedProject =
									pinnedProject === project.id
										? null
										: project.id;
								dispatch("pinned");
							}}
							class={pinnedProject === project.id
								? "bg-blue-light hover:bg-blue-light/80"
								: "bg-gray-500/40 hover:bg-gray-500/20"}
						>
							<Pin class="w-5 h-5" />
						</DashButton>
					{/if}

					<DashLink
						icon={true}
						href="/dashboard/projects/{project.url}"
						class="bg-blue-light hover:bg-blue-light/80"
					>
						<Pencil class="w-5 h-5" />
					</DashLink>

					{#if !minified && isOwner}
						<DashButton
							icon={true}
							on:click={() => {
								deleting = true;
								dispatch("delete");
							}}
							class="bg-red-light hover:bg-red-light/80"
						>
							<Trash class="w-5 h-5" />
						</DashButton>
					{/if}
				</div>
			</div>
		</div>
	</div>

	{#if open}
		<div
			transition:slide|local={{ duration: 200 }}
			class="flex justify-center px-3 gap-5 bg-gray-900 pb-4 pt-8 rounded-b-lg -mt-2 relative z-10 md:hidden"
		>
			{#if isOwner}
				<DashButton
					icon={true}
					on:click={() => (visible = !visible)}
					debounce={{
						bind: visible,
						func: () => toggleVisible,
						delay: 300
					}}
					class="bg-gray-500/40 hover:bg-gray-500/20"
				>
					<ShowHide class="w-5 h-5" crossed={visible} />
				</DashButton>

				<DashButton
					icon={true}
					on:click={() => {
						pinnedProject =
							pinnedProject === project.id ? null : project.id;
						dispatch("pinned");
					}}
					class={pinnedProject === project.id
						? "bg-blue-light hover:bg-blue-light/80"
						: "bg-gray-500/40 hover:bg-gray-500/20"}
				>
					<Pin class="w-5 h-5" />
				</DashButton>
			{/if}

			<DashLink
				icon={true}
				href="/dashboard/projects/{project.url}"
				class="bg-blue-light hover:bg-blue-light/80"
			>
				<Pencil class="w-5 h-5" />
			</DashLink>

			{#if !minified && isOwner}
				<DashButton
					icon={true}
					on:click={() => {
						deleting = true;
						dispatch("delete");
					}}
					class="bg-red-light hover:bg-red-light/80"
				>
					<Trash class="w-5 h-5" />
				</DashButton>
			{/if}
		</div>
	{/if}
</div>
