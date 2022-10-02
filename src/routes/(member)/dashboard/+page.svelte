<script lang="ts">
	import { user } from "$lib/stores";
	import { getIcon } from "$lib/getIcon";
	import Pin from "$lib/components/icons/Pin.svelte";
	import Bulb from "$lib/components/icons/Bulb.svelte";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import LinkIcon from "$lib/components/icons/LinkIcon.svelte";
	import ShowHide from "$lib/components/icons/ShowHide.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import DevTag from "$lib/components/developers/index/DevTag.svelte";
	import ExternalLink from "$lib/components/icons/ExternalLink.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import DeveloperSection from "$lib/components/DeveloperSection.svelte";
	import DashSection from "$lib/components/dashboard/index/DashSection.svelte";
	import ProjectEditPreview from "$lib/components/dashboard/projects/index/ProjectEditPreview.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	const greet = (hour: number) => {
		if (hour < 12) return "Good morning";
		if (hour < 17) return "Good afternoon";
		return "Good evening";
	};

	let visible = $user.visible;

	// Add functionality for pinning projects on the main dashboard
	let pinDebounce: NodeJS.Timeout;
	let pinnedProject = $user.pinnedProjectId;

	// Add typing to links since svelte doesnt allow typescript in statements
	let links: { [key: string]: string | null } = $user.links;

	// Update visility of user
	const toggleVisible = () => {
		fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: { id: $user.id },
				user: { visible }
			} as App.UserUpdateRequest)
		}).then(() => ($user.visible = visible));
	};

	// Debounce for pinned projects
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
			}).then(() => ($user.pinnedProjectId = pinnedProject));
		}, 300);
	};
</script>

<DashWrap>
	<DashHero
		title="{greet(new Date().getHours())}, {$user.name.split(' ')[0]}"
	/>

	<div class="flex flex-col gap-12">
		<DashSection
			title="Your Profile"
			class="bg-gray-500/40 p-4 flex flex-col gap-6"
		>
			<!-- TODO: Replace placeholder -->

			<div class="flex gap-6 items-center">
				<div class="relative shrink-0">
					<img
						height="200"
						width="200"
						src="/assets/developers/user/placeholder/icon.webp"
						alt="{$user.name}'s avatar"
						loading="lazy"
						class="rounded-full w-20 h-20"
					/>
					<div
						class="absolute bg-gray-500 -bottom-3 -right-2 rounded-full p-2"
					>
						<svelte:component
							this={getIcon($user.team || "")}
							class="w-5 h-5"
						/>
					</div>
				</div>
				<div>
					<div class="flex gap-2 items-center pt-4">
						<GradientText
							class="from-green-light to-green-dark text-3xl mx-auto"
						>
							{$user.name}
						</GradientText>
						<a
							target="_blank"
							rel="noopener noreffere"
							href="/developers/{$user.url}"
						>
							<ExternalLink
								class="w-6 h-6 text-green-dark mt-1.5"
							/>
						</a>
					</div>
					<h1 class="font-semibold">{$user.team || "No Team"}</h1>
				</div>
			</div>

			<p class="mx-auto md:text-lg">
				{$user.about}
			</p>

			<div class="flex flex-col gap-8 h-full">
				{#if $user.pinnedProject}
					<div class="mt-4">
						<div
							class="flex font-semibold justify-center items-center gap-2"
						>
							<Pin class="w-6 h-6" />
							<h1 class="text-lg">Pinned Project</h1>
						</div>

						<a
							href="/projects/{$user.pinnedProject.url}"
							rel="noreferrer noopener"
							class="block rounded-lg border-t-4 overflow-hidden bg-gray-500/40 w-full mx-auto mt-4 lg:flex lg:p-4"
							style="border-color: #{$user.pinnedProject.theme}"
						>
							<!-- TODO: Replace placeholders -->

							<img
								src="/assets/projects/project/placeholder/banner.webp"
								width="1920"
								height="1080"
								loading="lazy"
								alt="Banner for '{$user.pinnedProject.title}'"
								class="object-cover object-center w-full h-32 md:h-20 lg:w-24 lg:h-auto lg:rounded-lg"
							/>

							<div class="flex flex-col py-4 px-3 lg:py-1">
								<h1 class="font-semibold text-2xl md:text-xl">
									{$user.pinnedProject.title}
								</h1>
								<p class="mt-2 md:text-sm">
									{$user.pinnedProject.description}
								</p>
							</div>
						</a>
					</div>
				{/if}

				<DeveloperSection title="Positions">
					<Bulb slot="icon" class="w-6 h-6" />

					{#each $user.positions as position, i}
						{#if i <= 4}
							<DevTag name={position} />
						{/if}
					{/each}
				</DeveloperSection>

				<DeveloperSection title="Skills">
					<Wrench slot="icon" class="w-6 h-6" />

					{#each $user.techSkills as skill, i}
						{#if i <= 2}
							<DevTag name={skill} />
						{/if}
					{/each}
					{#each $user.softSkills as skill, i}
						{#if i <= 2}
							<DevTag name={skill} />
						{/if}
					{/each}
				</DeveloperSection>

				<DeveloperSection title="Links">
					<LinkIcon slot="icon" class="w-6 h-6" />

					{#each Object.keys(links) as link}
						{#if links[link] && link !== "userId"}
							<div
								class="flex justify-center items-center font-semibold bg-gray-800 rounded-lg gap-3 p-4"
							>
								<svelte:component
									this={getIcon(link)}
									class="w-7 h-7 shrink-0"
								/>
								<h1
									class="text-sm overflow-auto scrollbar-hidden"
								>
									{links[link]}
								</h1>
							</div>
						{/if}
					{/each}
				</DeveloperSection>

				<div class="flex gap-4 self-end">
					<DashButton
						icon={true}
						on:click={() => (visible = !visible)}
						debounce={{
							bind: visible,
							func: toggleVisible,
							delay: 300
						}}
						class="bg-gray-500/40"
					>
						<ShowHide class="w-5 h-5" crossed={visible} />
					</DashButton>
					<DashButton
						icon={true}
						href="/dashboard/profile"
						class="bg-blue-light"
					>
						<Pencil class="w-5 h-5" />
					</DashButton>
				</div>
			</div>
		</DashSection>

		<DashSection title="Your Projects" class="bg-gray-500/40 p-4">
			<div class="min-h-[55rem]">
				{#if data.projects && data.projects.length}
					{#each data.projects as project, i}
						{#if i < 2}
							<ProjectEditPreview
								bind:pinnedProject
								{project}
								user={$user}
								minified={true}
								on:pinned={togglePinned}
							/>
						{/if}
					{/each}
				{:else}
					<h1 class="text-center text-xl font-semibold my-auto">
						You don't have any projects
					</h1>
				{/if}
			</div>
			<DashButton
				href="/dashboard/projects"
				class="bg-gray-500/40 w-full mx-auto mt-4"
			>
				Manage Projects
			</DashButton>
		</DashSection>

		<!-- TODO: Kudos section -->
	</div>
</DashWrap>
