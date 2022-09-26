<script lang="ts">
	import { fly } from "svelte/transition";

	import { goto } from "$app/navigation";
	import Plus from "$lib/components/icons/Plus.svelte";
	import SearchBar from "$lib/components/SearchBar.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import ProjectLoader from "$lib/components/ProjectLoader.svelte";
	import ProjectEditPreview from "$lib/components/dashboard/projects/index/ProjectEditPreview.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	let search = "";
	let creatingProject = false;
	let deletingProject = false;
	let request: Promise<App.ProjectWithAuthors[]> = new Promise(() => {});

	// On search set request to never resolve so the loading animation is shown before the debounce
	$: search, (request = new Promise(() => {}));

	const onSearch = () => {
		request = new Promise((res, rej) =>
			fetch("/api/project", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					where: {
						title: {
							contains: search.trim(),
							mode: "insensitive"
						}
					}
				} as App.ProjectSearchRequest)
			})
				.then((res) => res.json())
				.then((data: App.ProjectWithAuthors[]) => {
					data.length ? res(data) : rej();
					deletingProject = false;
				})
		);
	};

	const createProject = () => {
		creatingProject = true;

		fetch("/api/project", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then((res) => res.json())
			.then((res: { url: string }) =>
				goto(`/dashboard/projects/${res.url}`)
			);
	};

	const deleteProject = async (id: string) => {
		// There is not reason for error handling here, either way it sends another search request and will update the page
		await fetch("/api/project", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id
			} as App.ProjectDeleteRequest)
		});

		deletingProject = true;

		onSearch();
	};

	const projectVisibility = (id: string, visible: boolean) => {
		fetch("/api/project", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					id
				},
				project: {
					visible
				}
			} as App.ProjectUpdateRequest)
		});
	};
</script>

<!-- TODO: Replace placeholder -->

<div
	class="flex flex-col gap-5 my-10 items-center lg:flex-row lg:justify-center lg:my-16"
>
	<img
		src="/developers/user/placeholder/icon.webp"
		alt="{data.user.name}'s avatar"
		class="w-20 h-20 rounded-full"
	/>

	<GradientText class="from-green-light to-green-dark text-3xl font-bold">
		Your Projects
	</GradientText>
</div>

<div class="px-6 max-w-xl mx-auto lg:max-w-screen-xl">
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

	<!-- Stop CLS when search results are changing -->
	<div class="min-h-[55rem]">
		{#await request}
			{#if !deletingProject}
				<ProjectLoader />
			{/if}
		{:then projects}
			{#each projects as project}
				<ProjectEditPreview
					bind:project
					user={data.user}
					on:delete={() => deleteProject(project.id)}
					on:visibile={() =>
						projectVisibility(project.id, project.visible)}
				/>
			{/each}
		{:catch}
			<h1
				in:fly={{ duration: 300, y: 30 }}
				class="text-center font-semibold text-2xl mt-4"
			>
				No projects
			</h1>
		{/await}
	</div>
</div>
