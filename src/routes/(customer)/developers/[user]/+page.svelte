<script lang="ts">
	import { onMount } from "svelte";

	import { getIcon } from "$lib/getIcon";
	import { analytics } from "$lib/analytics";
	import Button from "$lib/components/Button.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Icons from "$lib/components/developers/user/Icons.svelte";
	import Panel from "$lib/components/developers/user/Panel.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	// Get top 3 projects
	const previewedProjects = data.projects?.slice(0, 3);

	if (data.user.pinnedProject)
		previewedProjects.unshift(data.user.pinnedProject);

	const links = Object.entries(data.user.links)
		.filter(([_, link]) => link)
		.map(([key, link]) => ({
			key: key as keyof App.UserLinks,
			link: link!
		}));

	// Construct links based off of their name
	const createLink = (key: keyof App.UserLinks, link: string) => {
		switch (key) {
			case "GitHub":
				return `https://github.com/${link}`;
			case "LinkedIn":
				return `https://linkedin.com/in/${link}`;
			case "Devto":
				return `https://dev.to/${link}`;
			case "Twitter":
				return `https://twitter.com/${link}`;
			case "Facebook":
				return `https://facebook.com/${link}`;
			case "Website":
				return link;
		}
	};

	onMount(
		async () =>
			data.track &&
			(await analytics.track("user_view", {
				id: data.user.id
			}))
	);
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
				{#each links as link}
					<a
						href={createLink(link.key, link.link)}
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
					<Icons
						name="Technical"
						icons={data.user.techSkills}
						class="mt-4"
					/>
				</Panel>
			</div>
		</div>
	</div>
</div>
