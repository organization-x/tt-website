<script lang="ts">
	import { getIcon } from "$lib/getIcon";
	import Button from "$lib/components/Button.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Icons from "$lib/components/developers/user/Icons.svelte";
	import Panel from "$lib/components/developers/user/Panel.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";

	import type { PageData } from "./$types";
	import type { Links } from "@prisma/client";

	export let data: PageData;

	const previewedProjects = data.projects?.slice(0, 3) ?? [];

	if (data.user.pinnedProject) {
		previewedProjects.unshift({
			...data.user.pinnedProject,
			authors: data.user.pinnedProject.authors.map((a) => ({
				...a.user,
				position: a.position
			}))
		});
	}

	const linkArray = Object.entries(data.user.links ?? {})
		.filter(([_, link]) => link)
		.map(([key, link]) => ({ key: key as keyof Links, link: link! }));
</script>

<svelte:head>
	<title>{data.user.name} &ndash; Team Tomorrow</title>
</svelte:head>

<!-- TODO: Replace placeholders -->

<div class="relative">
	<div
		class="h-32 absolute inset-0 bottom-auto bg-cover bg-center -z-10"
		style="background-image: url(/assets/projects/project/placeholder/banner.webp);"
	/>
</div>

<div
	class="px-8 max-w-screen-md lg:max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4"
>
	<div class="mt-16 px-4 lg:w-60 xl:w-70 2xl:w-80">
		<div class="top-8 sticky">
			<img
				src="/assets/projects/project/placeholder/banner.webp"
				alt="Profile"
				class="w-32 h-32 rounded-full border-4 border-black"
			/>

			<div class="flex flex-col gap-4 mt-2">
				<GradientText
					class="from-green-light to-green-dark font-bold text-3xl"
				>
					{data.user.name}
				</GradientText>
				<p>
					{data.user.about}
				</p>
			</div>

			<Panel
				direction="bg-gradient-to-br"
				class="mt-4 flex gap-4 justify-center"
			>
				{#each linkArray as link}
					<a
						href="https://github.com/cubedhuang"
						class="hover:opacity-80 transition-opacity"
					>
						<svelte:component
							this={getIcon(link.key)}
							class="h-6 w-6"
						/>
					</a>
				{/each}
			</Panel>
		</div>
	</div>

	<div
		class="flex-1 grid xl:grid-cols-3 lg:mt-32 [align-items:start] gap-4 mx-4"
	>
		<div class="xl:col-span-2 flex flex-col gap-4">
			<div>
				<TextHeader>Projects</TextHeader>

				<Panel
					direction="bg-gradient-to-br"
					class="mt-2 flex flex-col gap-4"
				>
					{#each previewedProjects as project}
						<ProjectPreview {project} />
					{/each}

					<Button href="./projects">View More</Button>
				</Panel>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<div>
				<TextHeader>Positions</TextHeader>

				<Panel
					direction="bg-gradient-to-br"
					class="mt-2 grid grid-cols-2 xl:grid-cols-1 gap-2"
				>
					<Icons icons={data.user.positions} />
				</Panel>
			</div>

			<div>
				<TextHeader>Skills</TextHeader>

				<Panel direction="bg-gradient-to-br" class="mt-2">
					<Icons name="Soft" icons={data.user.softSkills} />
					<Icons name="Technical" icons={data.user.techSkills} />
				</Panel>
			</div>
		</div>
	</div>
</div>
