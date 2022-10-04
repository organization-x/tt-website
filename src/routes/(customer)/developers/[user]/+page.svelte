<script lang="ts">
	import { getIcon } from "$lib/getIcon";
	import Button from "$lib/components/Button.svelte";
	import GitHub from "$lib/components/icons/GitHub.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import LinkedIn from "$lib/components/icons/LinkedIn.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import { techSkills, softSkills, positions } from "$lib/enums";
	import Instagram from "$lib/components/icons/Instagram.svelte";
	import Panel from "$lib/components/developers/user/Panel.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";

	import type { Position, SoftSkill, TechSkill } from "@prisma/client";
</script>

<svelte:head>
	<title>Firstname Lastname &ndash; Team Tomorrow</title>
</svelte:head>

<!-- TODO: Replace placeholders -->

<div class="relative">
	<div
		class="h-32 absolute inset-0 bottom-auto bg-cover bg-center -z-10"
		style="background-image: url(/projects/project/placeholder/banner.webp);"
	/>
</div>

<div
	class="max-w-screen-md lg:max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4"
>
	<div class="mt-16 px-4 lg:max-w-sm">
		<img
			src="/projects/project/placeholder/banner.webp"
			alt="Profile"
			class="w-32 h-32 rounded-full border-4 border-black mx-auto"
		/>

		<div class="flex flex-col gap-4 mt-2 px-4">
			<GradientText
				class="from-green-light to-green-dark font-bold text-3xl text-center"
			>
				Jackson Choyce
			</GradientText>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum
				natus harum cupiditate ut delectus blanditiis maiores atque
				error nesciunt reiciendis asperiores necessitatibus obcaecati
				quasi sed ab, at ipsam rerum quibusdam.
			</p>
		</div>

		<Panel
			direction="bg-gradient-to-br"
			class="mt-4 flex gap-4 justify-center"
		>
			<a
				href="https://github.com/cubedhuang"
				class="hover:opacity-80 transition-opacity"
			>
				<GitHub class="h-6 w-6" />
			</a>
			<a
				href="https://instagram.com/cubedhuang/"
				class="hover:opacity-80 transition-opacity"
			>
				<Instagram class="h-6 w-6" />
			</a>
			<a
				href="https://www.linkedin.com/in/cubedhuang/"
				class="hover:opacity-80 transition-opacity"
			>
				<LinkedIn class="h-6 w-6" />
			</a>
		</Panel>
	</div>

	<div class="grid xl:grid-cols-2 lg:mt-32 [align-items:start] gap-4 mx-4">
		<div class="flex flex-col gap-4">
			<div>
				<TextHeader>Projects</TextHeader>

				<Panel
					direction="bg-gradient-to-br"
					class="mt-2 flex flex-col gap-4"
				>
					<!-- ProjectCard is the same as ProjectPreview, ProjectPreview is the component used on all other pages except for the dashboard -->
					<!-- project manager, it requires a project with attached authors which you will receive from the API calls -->
					<Button href="./placeholder/projects">View More</Button>
				</Panel>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<div>
				<TextHeader>Positions</TextHeader>

				<Panel
					direction="bg-gradient-to-br"
					class="mt-2 grid grid-cols-2 gap-4"
				>
					{#each positions as position}
						<div
							class="bg-gray-500/40 flex gap-2 items-center p-2 rounded"
						>
							<svelte:component
								this={getIcon(position)}
								class="w-8 h-8 shrink-0"
							/>
							<p class="text-sm">
								{position.replaceAll("_", " ")}
							</p>
						</div>
					{/each}
				</Panel>
			</div>

			<div>
				<TextHeader>Skills</TextHeader>

				<Panel direction="bg-gradient-to-br" class="mt-2">
					<h2 class="font-semibold text-lg lg:text-xl">Soft</h2>
					<div class="mt-2 grid grid-cols-2 gap-2">
						{#each softSkills as softSkill}
							<div
								class="bg-gray-500/40 flex gap-2 items-center p-2 rounded"
							>
								<svelte:component
									this={getIcon(softSkill)}
									class="w-8 h-8 shrink-0"
								/>
								<p class="text-sm">
									{softSkill.replaceAll("_", " ")}
								</p>
							</div>
						{/each}
					</div>

					<h2 class="mt-4 font-semibold text-lg lg:text-xl">
						Technical
					</h2>
					<div class="mt-2 grid grid-cols-2 gap-4">
						{#each techSkills as techSkill}
							<div
								class="bg-gray-500/40 flex gap-2 items-center p-2 rounded"
							>
								<svelte:component
									this={getIcon(techSkill)}
									class="w-8 h-8 shrink-0"
								/>
								<p class="text-sm">
									{techSkill.replaceAll("_", " ")}
								</p>
							</div>
						{/each}
					</div>
				</Panel>
			</div>
		</div>
	</div>
</div>
