<script lang="ts">
	import { user } from "$lib/stores";
	import { getIcon } from "$lib/getIcon";
	import DevTag from "$lib/components/DevTag.svelte";
	import Pin from "$lib/components/icons/Pin.svelte";
	import Bulb from "$lib/components/icons/Bulb.svelte";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import DevSection from "$lib/components/DevSection.svelte";
	import LinkIcon from "$lib/components/icons/LinkIcon.svelte";
	import ShowHide from "$lib/components/icons/ShowHide.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import DashLink from "$lib/components/dashboard/DashLink.svelte";
	import ExternalLink from "$lib/components/icons/ExternalLink.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import DashSection from "$lib/components/dashboard/DashSection.svelte";
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
	let pinnedProjectId = $user.pinnedProjectId;

	// Create a timestamp so the images from Cloudflare don't cache
	const timestamp = new Date().getTime();

	// Transform links into an array so it's easily iterable
	const links = Object.keys($user.links).map((key) => {
		return { key: key, link: $user.links[key as keyof typeof $user.links] };
	});

	// Split the name to get the first name and rest of the name seperated
	$: nameSplit = $user.name.split(/ (.*)/);

	// Define the pinned project, the reason we don't use the user store for this is so that it stays
	// updated with the database and also because updating the user store causes a refresh on the projects page
	// that in turn re mounts it when on the main dashboard
	let pinnedProject = data.projects
		? data.projects.find((project) => project.id === pinnedProjectId)
		: null;

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
						pinnedProjectId
					}
				} as App.UserUpdateRequest)
			}).then(async () => {
				$user.pinnedProjectId = pinnedProjectId;

				// Find the project to update the user store
				const project = data.projects!.find(
					(project) => project.id === pinnedProjectId
				);

				if (!project)
					return ($user.pinnedProject = null), (pinnedProject = null);

				pinnedProject = project;

				// Take the authors property from the project since the store has it as a different type
				const { authors, ...pin } = project;

				$user.pinnedProject = pin;
			});
		}, 300);
	};
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<DashWrap>
	<DashHero title="{greet(new Date().getHours())}, {nameSplit[0]}" />

	<div class="flex flex-col gap-12">
		<DashSection
			title="Your Profile"
			class="bg-gray-500/40 p-4 rounded-lg flex flex-col gap-8 lg:p-8 lg:gap-12"
		>
			<div class="lg:flex lg:gap-12">
				<div class="shrink-0">
					<div
						class="flex flex-col gap-2 items-center mb-6 shrink-0 md:flex-row md:gap-6 md:justify-center"
					>
						<div class="relative shrink-0 w-fit">
							<img
								height="512"
								width="512"
								src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{$user.id}/avatar?{timestamp}"
								alt="{$user.name}'s avatar"
								loading="lazy"
								class="rounded-full w-20 h-20 bg-gray-400 lg:w-24 lg:h-24"
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
						<div
							class="flex flex-col gap-2 items-center pt-4 w-fit md:flex-col-reverse md:items-start"
						>
							<h1 class="font-semibold">
								{$user.team || "No Team"}
							</h1>
							<div
								class="text-3xl text-center sm:flex sm:items-center sm:gap-2"
							>
								<GradientText
									class="from-green-light to-green-dark"
								>
									{$user.name}
								</GradientText>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href="/developers/{$user.url}"
								>
									<ExternalLink
										class="w-6 h-6 text-green-dark mx-auto mt-1.5"
									/>
								</a>
							</div>
						</div>
					</div>

					<p
						class="my-12 text-center md:text-lg lg:text-left lg:max-w-sm lg:min-w-[24rem] lg:my-0"
					>
						{$user.about}
					</p>
				</div>

				<div class="mt-4 w-full min-h-[18rem]">
					<div
						class="flex font-semibold justify-center items-center gap-2"
					>
						<Pin class="w-6 h-6" />
						<h1 class="text-lg">Pinned Project</h1>
					</div>

					{#if pinnedProject}
						<a
							target="_blank"
							href="/projects/{pinnedProject.url}"
							rel="noopener noreferrer"
							class="block rounded-lg border-t-4 overflow-hidden bg-gray-500/40 w-full mx-auto mt-4"
							style="border-color: #{pinnedProject.theme}"
						>
							<img
								src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{pinnedProject.id}/banner?{timestamp}"
								width="1920"
								height="1080"
								loading="lazy"
								alt="Banner for '{pinnedProject.title}'"
								class="object-cover object-center bg-gray-400 w-full h-32 md:h-20"
							/>

							<div class="flex flex-col py-4 px-3">
								<h1 class="font-semibold text-2xl md:text-xl">
									{pinnedProject.title}
								</h1>
								<p class="mt-2 md:text-sm">
									{pinnedProject.description}
								</p>
							</div>
						</a>
					{:else}
						<div
							class="rounded-lg border-gray-800 border-4 border-dashed h-56 mt-4"
						/>
					{/if}
				</div>
			</div>

			<div class="grid gap-8 lg:gap-y-0 lg:grid-cols-2">
				<DevSection
					title="Positions"
					class="lg:row-start-1 lg:col-start-1"
				>
					<Bulb slot="icon" class="w-6 h-6" />

					{#each { length: 4 } as _, i}
						<DevTag name={$user.positions[i]} />
					{/each}
				</DevSection>

				<DevSection
					title="Skills"
					class="lg:col-start-2 lg:row-start-1"
				>
					<Wrench slot="icon" class="w-6 h-6" />

					{#each $user.techSkills as name}
						<DevTag {name} />
					{/each}

					{#each $user.softSkills as name}
						<DevTag {name} />
					{/each}

					<!-- Get the collective amount of techSkills and softSkills missing -->
					{#each { length: 10 - ($user.techSkills.length + $user.softSkills.length) } as _, i}
						<DevTag name="" />
					{/each}
				</DevSection>

				<DevSection
					title="Links"
					class="lg:row-start-1 lg:col-start-1 lg:mt-56"
				>
					<LinkIcon slot="icon" class="w-6 h-6" />

					{#each { length: 6 } as _, i}
						{#if links[i].link}
							<div
								class="flex justify-center items-center font-semibold bg-gray-800 rounded-lg gap-3 p-4"
							>
								<svelte:component
									this={getIcon(links[i].key)}
									class="w-7 h-7 shrink-0"
								/>
								<h1
									class="text-sm overflow-auto scrollbar-hidden"
								>
									{links[i].link}
								</h1>
							</div>
						{:else}
							<DevTag name="" />
						{/if}
					{/each}
				</DevSection>

				<div
					class="flex gap-4 ml-auto lg:col-start-2 lg:row-start-1 lg:self-end"
				>
					<DashButton
						icon={true}
						on:click={() => (visible = !visible)}
						debounce={{
							bind: visible,
							func: toggleVisible,
							delay: 300
						}}
						class="bg-gray-500/40 hover:bg-gray-500/20"
					>
						<ShowHide class="w-5 h-5" crossed={visible} />
					</DashButton>

					<DashLink
						icon={true}
						href="/dashboard/profile"
						class="bg-blue-light hover:bg-blue-light/80"
					>
						<Pencil class="w-5 h-5" />
					</DashLink>
				</div>
			</div>
		</DashSection>

		<DashSection
			title="Your Projects"
			class="bg-gray-500/40 rounded-lg p-4"
		>
			<div
				class="min-h-[55rem] flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:min-h-0 lg:mb-8"
			>
				{#if data.projects && data.projects.length}
					{#each { length: 2 } as _, i}
						{@const project = data.projects[i]}

						{#if project}
							<ProjectEditPreview
								bind:pinnedProject={pinnedProjectId}
								{project}
								minified={true}
								on:pinned={togglePinned}
							/>
						{:else}
							<div
								class="rounded-lg border-gray-800 border-4 border-dashed flex-1 h-full"
							/>
						{/if}
					{/each}
				{:else}
					<div
						class="rounded-lg border-gray-800 border-4 border-dashed flex-1 h-104"
					/>
					<div
						class="rounded-lg border-gray-800 border-4 border-dashed flex-1 h-104"
					/>
				{/if}
			</div>

			<DashLink
				href="/dashboard/projects"
				class="bg-gray-500/40 hover:bg-gray-500/20 w-full mx-auto mt-4 lg:mt-0 lg:w-fit lg:mr-0"
			>
				Manage All Projects
			</DashLink>
		</DashSection>

		<!-- TODO: Kudos section -->
	</div>
</DashWrap>
