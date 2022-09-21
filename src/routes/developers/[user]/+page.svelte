<script lang="ts">
	import { page } from "$app/stores";

	import GitHub from "$lib/components/icons/GitHub.svelte";
	import LinkedIn from "$lib/components/icons/LinkedIn.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Instagram from "$lib/components/icons/Instagram.svelte";
	import Panel from "$lib/components/developers/user/index/Panel.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import ProjectCard from "$lib/components/developers/user/index/ProjectCard.svelte";
	import Button from "$lib/components/Button.svelte";
	import { getIcon } from "$lib/components/icons/getIcon";

	import type { Position, SoftSkill, TechSkill } from "@prisma/client";

	const user = $page.params.user; // Slug passed in for retrieving user data

	const positions: Position[] = ["Frontend", "Fullstack"];
	const softSkills: SoftSkill[] = [
		"Leadership",
		"Proactive",
		"Teamwork",
		"Writing"
	];
	const techSkills: TechSkill[] = [
		"AWS",
		"Google_Cloud",
		"JavaScript",
		"React"
	];
</script>

<!-- TODO: Switch banner/icon to proper defaults. Right now its set to the banner because its bright and easy to differentiate -->

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
			<GitHub class="h-6 w-6" />
			<Instagram class="h-6 w-6" />
			<LinkedIn class="h-6 w-6" />
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
					<ProjectCard
						name="Team Tomorrow Website"
						description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus accusantium recusandae ducimus! Id maxime totam cupiditate deserunt beatae numquam velit, omnis debitis eius eaque iure minus! Tempore nulla sint inventore?"
						href="/projects/team-tomorrow"
						img="https://unsplash.it/400/300"
						developers={[
							{
								name: "Jackson Choyce",
								url: "/projects/team-tomorrow",
								position: "Developer"
							},
							{
								name: "Bernice Lau",
								url: "/projects/team-tomorrow",
								position: "Developer"
							}
						]}
					/>
					<ProjectCard
						name="AI Camp Discord Bot"
						description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt veritatis rem natus nihil at deserunt iusto neque! Iste dolorem laudantium, consectetur eius repudiandae vel non?"
						href="/projects/team-tomorrow"
						img="https://unsplash.it/400/310"
						developers={[
							{
								name: "Jackson Choyce",
								url: "/projects/team-tomorrow",
								position: "Developer"
							},
							{
								name: "Bernice Lau",
								url: "/projects/team-tomorrow",
								position: "Developer"
							}
						]}
					/>

					<Button href="./{user}/projects">View More</Button>
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
