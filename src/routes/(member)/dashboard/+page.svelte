<script lang="ts">
	import { user } from "$lib/stores";
	import { getIcon } from "$lib/getIcon";
	import DevTag from "$lib/components/DevTag.svelte";
	import Id from "$lib/components/icons/general/Id.svelte";
	import Pin from "$lib/components/icons/general/Pin.svelte";
	import DevSection from "$lib/components/DevSection.svelte";
	import Bulb from "$lib/components/icons/general/Bulb.svelte";
	import Plus from "$lib/components/icons/general/Plus.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Wrench from "$lib/components/icons/general/Wrench.svelte";
	import Pencil from "$lib/components/icons/general/Pencil.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import DashLink from "$lib/components/dashboard/DashLink.svelte";
	import TrendUp from "$lib/components/icons/general/TrendUp.svelte";
	import TenKudos from "$lib/components/icons/badges/TenKudos.svelte";
	import LinkIcon from "$lib/components/icons/general/LinkIcon.svelte";
	import ShowHide from "$lib/components/icons/general/ShowHide.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import DashSection from "$lib/components/dashboard/DashSection.svelte";
	import FiftyKudos from "$lib/components/icons/badges/FiftyKudos.svelte";
	import TenProjects from "$lib/components/icons/badges/TenProjects.svelte";
	import AllEndorsed from "$lib/components/icons/badges/AllEndorsed.svelte";
	import HundredKudos from "$lib/components/icons/badges/HundredKudos.svelte";
	import ExternalLink from "$lib/components/icons/general/ExternalLink.svelte";
	import TwentyProjects from "$lib/components/icons/badges/TwentyProjects.svelte";
	import BadgeProgress from "$lib/components/dashboard/index/BadgeProgress.svelte";
	import ProjectEditPreview from "$lib/components/dashboard/projects/index/ProjectEditPreview.svelte";

	import type { PageData } from "./$types";
	import { onMount } from "svelte";

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

	// Store badges parent element and the indicies of the active badges for scroll progress effect
	let badges: HTMLDivElement;
	let playing = new Set<number>();

	// Create set to determine whether all of this user's skills are endorsed
	const endorsed = new Set(
		data.endorsementsReceived.map(
			(endorsement) => endorsement.softSkill || endorsement.techSkill
		)
	).size;

	// Create a count of projects that are visible
	const projectCount = data.projects.filter(
		(project) => project.visible
	).length;

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
				id: $user.id,
				visible
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
					id: $user.id,
					pinnedProjectId
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

	onMount(() => {
		const children = Array.from(badges.children);

		const observer: IntersectionObserver = new IntersectionObserver(
			(entries) =>
				playing.size === children.length
					? observer.disconnect()
					: entries.forEach(
							(entry) =>
								entry.isIntersecting &&
								playing.add(children.indexOf(entry.target)) &&
								(playing = playing)
					  ),
			{ threshold: 0.9 }
		);

		// Get all badges as children and observe them for the scrolling animation
		children.forEach((badge) => {
			observer.observe(badge);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<DashWrap>
	<DashHero title="{greet(new Date().getHours())}, {nameSplit[0]}" />

	<div class="flex flex-col gap-12">
		<DashSection
			title="Get Started"
			class="bg-gray-500/40 p-4 rounded-lg lg:flex lg:gap-8 lg:items-center"
		>
			<p class="mb-8 lg:mb-0 lg:max-w-sm lg:mx-auto">
				{#if $user.role === "User"}
					Top developers on the home page will be rotated every month,
					so to secure your spot, participate by learning new skills,
					creating projects, and helping out Team Tomorrow members
					around you. Your kudos and badges play a role in your
					ranking as well, so make sure to engage whenever you can and
					keep your profile up to date.
				{:else if $user.role === "Lead"}
					Empower other Team Tomorrow members by endorsing their
					skills and leading them in the right direction. To endorse a
					skill, simply go to the user's profile and use the plus
					button on whichever skill you wish. Your endorsements will
					be used to help employers find the right people for their
					projects, and serve as proof of Team Tomorrow's capability.
				{:else}
					Take control of the Team Tomorrow website by checking
					sitewide analytics to see what employers are most interested
					in, directly editing user profiles to ensure they are up to
					date, and by managing projects so they are never left in the
					dust. Like leads, you are also able to endorse skills, and
					serve proof of Team Tomorrow's capability.
				{/if}
			</p>

			<div class="flex flex-col gap-4 lg:w-1/2">
				{#if $user.role === "User"}
					<DashLink
						href="/dashboard/projects"
						class="bg-gray-500/40 hover:bg-gray-500/20 flex gap-2 items-center justify-center"
					>
						<Plus class="w-6 h-6" />
						Create a New Project
					</DashLink>
				{:else if $user.role === "Lead"}
					<DashLink
						href="/developers"
						class="bg-gray-500/40 hover:bg-gray-500/20 flex gap-2 items-center justify-center"
					>
						<Plus class="w-6 h-6" />
						Endorse a skill
					</DashLink>
				{:else}
					<DashLink
						href="/developers"
						class="bg-gray-500/40 hover:bg-gray-500/20 flex gap-2 items-center justify-center"
					>
						<Plus class="w-6 h-6" />
						Manage All Projects
					</DashLink>
				{/if}

				{#if $user.role !== "Admin"}
					<DashLink
						href="/dashboard/profile"
						class="bg-gray-500/40 hover:bg-gray-500/20 flex gap-2 items-center justify-center"
					>
						<Id class="w-6 h-6" />
						Update Your Profile
					</DashLink>
				{:else}
					<DashLink
						href="/dashboard/profile"
						class="bg-gray-500/40 hover:bg-gray-500/20 flex gap-2 items-center justify-center"
					>
						<Id class="w-6 h-6" />
						Manage All Users
					</DashLink>
				{/if}

				{#if $user.role !== "Admin"}
					<DashLink
						href="/dashboard/analytics"
						class="bg-gray-500/40 hover:bg-gray-500/20 flex gap-2 items-center justify-center"
					>
						<TrendUp class="w-6 h-6" />
						Check Your Analytics
					</DashLink>
				{:else}
					<DashLink
						href="/dashboard/analytics"
						class="bg-gray-500/40 hover:bg-gray-500/20 flex gap-2 items-center justify-center"
					>
						<TrendUp class="w-6 h-6" />
						Check Sitewide Analytics
					</DashLink>
				{/if}
			</div>
		</DashSection>

		<DashSection
			title="Your Profile"
			class="bg-gray-500/40 p-4 rounded-lg flex flex-col gap-8 lg:p-8 lg:gap-12"
		>
			<div class="lg:flex lg:gap-8">
				<div
					class="flex flex-col gap-2 items-center mb-6 md:gap-8 md:mt-4 md:items-start lg:w-1/2"
				>
					<div class="shrink-0 md:flex md:gap-6">
						<div
							class="relative w-fit h-fit mx-auto md:mx-0 lg:shrink-0"
						>
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
							class="flex flex-col justify-center items-center pt-4 w-fit md:flex-col-reverse md:items-start md:pt-0"
						>
							<h1 class="font-semibold lg:-mt-1">
								{$user.team || "No Team"}
							</h1>

							<GradientText
								class="from-green-light to-green-dark scrollbar-hidden text-3xl text-center md:text-start"
							>
								{$user.name}
							</GradientText>
						</div>
					</div>

					<p
						class="mb-12 text-center md:text-lg md:text-start lg:my-0"
					>
						{$user.about}
					</p>
				</div>

				<div class="mt-4 w-full min-h-[18rem] lg:w-1/2">
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
					title="Top Skills"
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
					<DashLink
						icon={true}
						href="/developers/{data.url}"
						target="_blank"
						class="bg-gray-500/40 hover:bg-gray-500/20"
					>
						<ExternalLink class="w-5 h-5" />
					</DashLink>

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

		<div class="flex flex-col gap-5">
			<h1 class="font-semibold text-2xl text-center">Your Badges</h1>
			<div
				bind:this={badges}
				class="h-full bg-gray-500/40 p-4 rounded-lg flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:grid-flow-row-dense"
			>
				<!-- TODO: Kudos Data-->

				<BadgeProgress
					name="Project Starter"
					playing={playing.has(0)}
					progress={projectCount / 10}
					class="bg-blue-light"
				>
					<TenProjects slot="badge" />

					Create 10+ projects that anyone can view
				</BadgeProgress>

				<BadgeProgress
					name="Project Master"
					playing={playing.has(1)}
					progress={projectCount / 20}
					class="bg-pink-light"
				>
					<TwentyProjects slot="badge" />

					Create 20+ projects that anyone can view
				</BadgeProgress>

				<BadgeProgress
					name="All Endorsed"
					playing={playing.has(2)}
					progress={endorsed / 10}
					class="bg-purple-light"
				>
					<AllEndorsed slot="badge" />

					Have the max of 10 skills all endorsed
				</BadgeProgress>

				<BadgeProgress
					name="Kudo Starter"
					playing={playing.has(3)}
					progress={0}
					class="bg-red-light"
				>
					<TenKudos slot="badge" />

					Get 10+ kudos from other developers
				</BadgeProgress>

				<BadgeProgress
					name="Kudo Master"
					playing={playing.has(4)}
					progress={0}
					class="bg-teal-light"
				>
					<FiftyKudos slot="badge" />

					Get 50+ kudos from other developers
				</BadgeProgress>

				<BadgeProgress
					name="Kudo Legend"
					playing={playing.has(5)}
					progress={0}
					class="bg-green-light"
				>
					<HundredKudos slot="badge" />

					Get 100+ kudos from other developers
				</BadgeProgress>
			</div>
		</div>

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
