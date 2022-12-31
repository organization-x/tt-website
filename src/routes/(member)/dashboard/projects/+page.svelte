<script lang="ts">
	import { getContext } from "svelte";
	import { fly } from "svelte/transition";

	import { user } from "$lib/stores";
	import { goto } from "$app/navigation";
	import DashHero from "../DashHero.svelte";
	import DashWrap from "../DashWrap.svelte";
	import Plus from "$lib/icons/general/Plus.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import ProjectEditPreview from "../ProjectEditPreview.svelte";
	import ProjectLoading from "$lib/components/ProjectLoading.svelte";

	import type { Prisma } from "@prisma/client";
	import type { Writable } from "svelte/store";

	const tabindex = getContext<Writable<number>>("tabindex");

	let search = "";
	let creatingProject = false;
	let pinDebounce: NodeJS.Timeout;
	let deletingProjects: string[] = [];
	let pinnedProject = $user.pinnedProjectId;
	let request: Promise<App.ProjectWithMetadata[]> = new Promise(() => {});

	// On search set request to never resolve so the loading animation is shown before the debounce and
	// also reset the deleting projects array so we don't have old ID's
	$: search, (request = new Promise(() => {})), (deletingProjects = []);

	const onSearch = () =>
		(request = fetch(
			`/api/project?where=${JSON.stringify({
				title: {
					contains: search.trim(),
					mode: "insensitive"
				},

				...($user.role === "Admin"
					? {}
					: {
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
					  })
			} as Prisma.ProjectWhereInput)}`
		)
			.then((res) => res.json())
			.then((data: App.ProjectWithMetadata[]) =>
				data.length ? data : Promise.reject()
			));

	const createProject = () => {
		creatingProject = true;

		fetch("/api/project", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then((res) => res.json())
			.then((res: App.ProjectCreateResponse) =>
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

		deletingProjects = [...deletingProjects, id];
	};

	// Debounce for pinned projects, it's like this so the UI will stay reactive and
	// only show one allowed pinned project but will eventually update
	// the database after a settlement period
	const togglePinned = () => {
		clearTimeout(pinDebounce);

		pinDebounce = setTimeout(async () => {
			fetch("/api/user", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: $user.id,
					pinnedProjectId: pinnedProject
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

	// Handle the animation when projects are deleted by making the last
	// project responsible for re-querying the search
	const onEnd = (id: string) =>
		deletingProjects.includes(id) &&
		deletingProjects[deletingProjects.length - 1] === id &&
		onSearch();
</script>

<svelte:head>
	<title>Project Manager</title>
</svelte:head>

<DashHero
	title={$user.role === "Admin" ? "Manage Projects" : "Your Projects"}
/>

<DashWrap>
	<div class="flex flex-col gap-5 mb-5 mx-auto lg:flex-row lg:mb-20">
		<SearchBar
			bind:search
			on:input={() => (request = new Promise(() => {}))}
			on:search={onSearch}
			placeholder="Search your projects..."
			lightBg={false}
		/>

		<button
			disabled={creatingProject}
			class:opacity-70={creatingProject}
			on:click={createProject}
			class="bg-gray-900 rounded-lg w-full p-4 flex items-center transition-backpacity justify-center gap-2 hover:bg-gray-900/60 lg:w-40 lg:shrink-0"
			tabindex={$tabindex}
		>
			<Plus class="w-4 h-4{creatingProject ? ' animate-spin' : ''}" />
			New Project
		</button>
	</div>

	<div class="min-h-[75.5rem]">
		{#await request}
			<div class="flex flex-col gap-14">
				<ProjectLoading />
			</div>
		{:then projects}
			<div in:fly={{ duration: 300, y: 30 }}>
				{#each projects as project (project.id)}
					{#if !deletingProjects.includes(project.id)}
						<ProjectEditPreview
							bind:pinnedProject
							{project}
							on:delete={() => deleteProject(project.id)}
							on:pinned={togglePinned}
							on:outroend={() => onEnd(project.id)}
							lightBg={false}
						/>
					{/if}
				{/each}
			</div>
		{:catch}
			<h1
				in:fly={{ duration: 300, y: 30 }}
				class="text-center font-semibold text-2xl pt-5"
			>
				No Projects
			</h1>
		{/await}
	</div>
</DashWrap>
