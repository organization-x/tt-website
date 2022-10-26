<script lang="ts">
	import { fly } from "svelte/transition";

	import { user } from "$lib/stores";
	import { goto } from "$app/navigation";
	import Plus from "$lib/components/icons/Plus.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import ProjectLoading from "$lib/components/ProjectLoading.svelte";
	import ProjectEditPreview from "$lib/components/dashboard/projects/index/ProjectEditPreview.svelte";

	import type { Prisma } from "@prisma/client";

	let search = "";
	let creatingProject = false;
	let pinDebounce: NodeJS.Timeout;
	let deletingProjects: string[] = [];
	let pinnedProject = $user.pinnedProjectId;
	let request: Promise<App.ProjectWithMetadata[]> = new Promise(() => {});

	// On search set request to never resolve so the loading animation is shown before the debounce and
	// also reset the deleting projects array so we don't have old ID's
	$: search, (request = new Promise(() => {})), (deletingProjects = []);

	const onSearch = () => {
		request = new Promise((res, rej) =>
			fetch(
				`/api/project?where=${JSON.stringify({
					title: {
						contains: search.trim(),
						mode: "insensitive"
					},

					OR: [
						{
							ownerId: $user.id
						},
						{
							authors: {
								some: {
									userId: $user.id
								}
							}
						}
					]
				} as Prisma.ProjectWhereInput)}`
			)
				.then((res) => res.json())
				.then((data: App.ProjectWithMetadata[]) =>
					data.length ? res(data) : rej()
				)
		);
	};

	const createProject = () => {
		creatingProject = true;

		fetch("/api/project", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then((res) => res.json())
			.then((res: { url: string }) =>
				goto(`/dashboard/projects/${res.url}`)
			);
	};

	// Deletes a project and sets the currently deleting project id.
	// This is so we can cleanly animate the project getting deleted without
	// the each statement making it choppy
	const deleteProject = async (id: string) => {
		await fetch("/api/project", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id
			} as App.ProjectDeleteRequest)
		});

		// If the project is pinned, unpin it
		if (pinnedProject === id) pinnedProject = null;

		deletingProjects.push(id);

		deletingProjects = deletingProjects;
	};

	// Debounce for pinned projects, it's like this so the UI will stay reactive and
	// only show one allowed pinned project but will eventually update
	// the database after a settlement period
	const togglePinned = () => {
		clearTimeout(pinDebounce);

		pinDebounce = setTimeout(() => {
			fetch("/api/user", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					where: {
						id: $user.id
					},
					user: {
						pinnedProjectId: pinnedProject
					}
				} as App.UserUpdateRequest)
			}).then(async () => {
				$user.pinnedProjectId = pinnedProject;

				// Find the project to update the user store
				const project = (await request).find(
					(project) => project.id === pinnedProject
				);

				if (!project) return ($user.pinnedProject = null);

				const { authors, ...pin } = project;

				$user.pinnedProject = pin;
			});
		}, 300);
	};
</script>

<svelte:head>
	<title>Project Manager</title>
</svelte:head>

<DashHero title="Your Projects" />

<DashWrap>
	<div class="flex flex-col gap-5 mb-5 mx-auto lg:flex-row lg:mb-20">
		<SearchBar
			bind:search
			on:input={() => (request = new Promise(() => {}))}
			on:search={onSearch}
			placeholder="Search projects you made..."
		/>
		<button
			disabled={creatingProject}
			class:opacity-70={creatingProject}
			on:click={createProject}
			class="bg-gray-500/40 rounded-lg w-full p-4 flex items-center justify-center gap-2 lg:w-40 lg:shrink-0"
		>
			<Plus class="w-6 h-6{creatingProject ? ' animate-spin' : ''}" />
			New Project
		</button>
	</div>

	<div class="min-h-[55rem]">
		{#await request}
			<ProjectLoading />
		{:then projects}
			{#each projects as project}
				{#if !deletingProjects.includes(project.id)}
					<ProjectEditPreview
						bind:project
						bind:pinnedProject
						on:delete={() => deleteProject(project.id)}
						on:pinned={togglePinned}
						on:outroend={async () => {
							// If this project isn't being deleted, ignore
							if (!deletingProjects.includes(project.id)) return;

							// If it's the latest project being deleted then make it responsible for updating the search
							if (
								deletingProjects[
									deletingProjects.length - 1
								] === project.id
							)
								onSearch();
						}}
					/>
				{/if}
			{/each}
		{:catch}
			<h1
				in:fly={{ duration: 300, y: 30 }}
				class="text-center font-semibold text-2xl pt-5"
			>
				No projects
			</h1>
		{/await}
	</div>
</DashWrap>
