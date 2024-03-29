<script lang="ts">
	import { getContext } from "svelte";
	import { getIcon } from "$lib/getIcon";
	import DevTag from "$lib/components/DevTag.svelte";
	import Button from "$lib/components/Button.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Skill from "$lib/components/developers/user/Skill.svelte";
	import Badge from "$lib/components/developers/user/Badge.svelte";
	import ProfileSection from "$lib/components/ProfileSection.svelte";
	import ProjectPreview from "$lib/components/ProjectPreview.svelte";
	import TenProjects from "$lib/components/icons/badges/TenProjects.svelte";
	import AllEndorsed from "$lib/components/icons/badges/AllEndorsed.svelte";
	import TwentyProjects from "$lib/components/icons/badges/TwentyProjects.svelte";

	import type { PageData } from "./$types";
	import type { SoftSkill, TechSkill } from "@prisma/client";

	export let data: PageData;

	// Get top 3 projects
	const previewedProjects = data.projects?.slice(0, 3);

	// Create a timestamp so the images from Cloudflare don't cache
	const timestamp = getContext("timestamp") as string;

	// Keep track of the current projects being endorsed by the current user so
	// animations play correctly
	let endorsingSkills = new Set<TechSkill | SoftSkill>();

	if (data.user.pinnedProject)
		previewedProjects.unshift(data.user.pinnedProject);

	const links = Object.entries(data.user.links)
		.filter(([_, link]) => link)
		.map(([key, link]) => ({
			key: key as keyof App.UserLinks,
			link: link!
		}));

	// Construct an endorsements object with each skill the user has selected as a property
	let endorsements = Object.fromEntries(
		[...data.user.techSkills, ...data.user.softSkills].map((skill) => [
			skill,
			[]
		])
	) as { [key: string]: { id: number; from: App.Endorser }[] };

	// Add each endorsement to the correct skill
	data.user.endorsementsReceived.forEach((endorsement) =>
		endorsements[(endorsement.softSkill || endorsement.techSkill)!].push({
			id: endorsement.id,
			from: endorsement.from
		})
	);

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

	// Add/remove endorsements from this user
	const updateEndorsements = async (
		skill: TechSkill | SoftSkill,
		endorsing: boolean,
		type: "softSkill" | "techSkill"
	) => {
		if (!data.endorserId) return;

		// Mark this skill as being endorsed
		endorsingSkills.add(skill);

		// Re-assign for re-render
		endorsingSkills = endorsingSkills;

		// If the endorsement is being added then supply the user ID of whom it is being added
		// to, otherwise supply the ID of the endorsement being removed
		const id = endorsing
			? data.user.id
			: endorsements[skill].find(
					(endorsement) => endorsement.from.id === data.endorserId
			  )!.id;

		// Fetch the API and afterwards either add the new endorsement returned by it or remove the
		// endorsement
		await fetch("/api/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id,
				[type]: skill,
				endorsing: endorsing
			} as App.EndorsementRequest)
		}).then(async (res) =>
			endorsing
				? endorsements[skill].push(await res.json()) &&
				  (endorsements = endorsements)
				: (endorsements[skill] = endorsements[skill].filter(
						(endorsement) => endorsement.id !== id
				  ))
		);

		// Remove the skill from the set of skills being endorsed
		endorsingSkills.delete(skill);

		// Re-assign for re-render
		endorsingSkills = endorsingSkills;
	};
</script>

<svelte:head>
	<title>{data.user.name} / Team Tomorrow</title>
</svelte:head>

<div class="relative pt-18 px-5 lg:px-10">
	<img
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{data.user
			.id}/banner?{timestamp}"
		width="1920"
		height="1080"
		alt="{data.user.name}'s banner"
		class="-z-10 absolute bg-gray-400 top-0 inset-0 object-cover object-center w-full h-32 lg:h-44"
	/>

	<div
		class="mx-auto max-w-xl lg:flex lg:gap-10 lg:justify-between lg:max-w-screen-lg lg:mx-auto 3xl:max-w-screen-3xl "
	>
		<div
			class="mb-8 max-w-sm mx-auto flex flex-col gap-2 items-center lg:mt-10 lg:mb-0 lg:flex-col lg:items-start lg:w-1/2 lg:sticky lg:top-6 lg:mx-0 lg:h-fit"
		>
			<img
				width="512"
				height="512"
				src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{data
					.user.id}/avatar?{timestamp}"
				alt="{data.user.name}'s avatar"
				class="border-4 mt-4 border-black bg-gray-400 box-content w-28 h-28 rounded-full lg:w-32 lg:mx-0 lg:h-32 lg:mb-2"
			/>

			<h1 class="font-semibold text-lg text-center lg:text-start">
				{data.user.team || "No Team"}
			</h1>

			<GradientText
				class="from-green-light to-green-dark text-center font-bold text-3xl break-words w-full lg:text-start"
			>
				{data.user.name}
			</GradientText>

			<p class="mx-auto lg:w-64 lg:mx-0">
				{data.user.about}
			</p>

			{#if links.length}
				<div
					class="p-3 w-full flex items-center justify-evenly md:px-0 md:gap-4 lg:justify-start"
				>
					{#each links as link}
						<a
							href={createLink(link.key, link.link)}
							rel="noopener noreferrer"
							target="_blank"
						>
							<svelte:component
								this={getIcon(link.key)}
								class="w-8 h-8 lg:w-7 lg:h-7"
							/>
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<div
			class="max-w-xl lg:min-w-[28rem] lg:mt-40 lg:w-1/2 3xl:flex 3xl:gap-10 3xl:min-w-[58rem]"
		>
			<div class="flex flex-col gap-8 mb-8 3xl:w-full">
				<ProfileSection title="Positions">
					{#each data.user.positions as name}
						<DevTag {name} />
					{/each}
				</ProfileSection>

				<ProfileSection title="Projects" minHeight={true}>
					{#each { length: 2 } as _, i}
						{#if data.projects[i]}
							<ProjectPreview project={data.projects[i]} />
						{/if}
					{/each}

					{#if data.projects.length}
						<Button
							href="/developers/{data.user.url}/projects"
							class="mb-2">View More</Button
						>
					{:else}
						<h1 class="font-semibold text-xl m-auto">
							No Projects
						</h1>
					{/if}
				</ProfileSection>
			</div>

			<div class="flex flex-col gap-8 w-full 3xl:w-full">
				<ProfileSection title="Top Skills">
					{@const endorser =
						data.endorserId && data.endorserId !== data.user.id
							? data.endorserId
							: null}

					<div class="flex flex-col gap-6">
						<h1 class="font-semibold text-xl text-center">Soft</h1>
						{#each data.user.softSkills as name}
							<Skill
								{name}
								{endorser}
								endorsements={endorsements[name]}
								endorsing={endorsingSkills.has(name)}
								on:endorsement={({ detail }) =>
									updateEndorsements(
										detail.skill,
										detail.endorsing,
										"softSkill"
									)}
							/>
						{/each}
					</div>

					<div class="flex flex-col gap-6">
						<h1 class="font-semibold text-xl text-center">
							Technical
						</h1>
						{#each data.user.techSkills as name}
							<Skill
								{name}
								{endorser}
								endorsements={endorsements[name]}
								endorsing={endorsingSkills.has(name)}
								on:endorsement={({ detail }) =>
									updateEndorsements(
										detail.skill,
										detail.endorsing,
										"techSkill"
									)}
							/>
						{/each}
					</div>
				</ProfileSection>

				<ProfileSection title="Badges" minHeight={true}>
					<!-- Store the badge booleans in an array so we can figure out of the user has none -->
					{@const badges = [
						data.projects.length >= 10,
						data.projects.length >= 20,
						new Set(
							data.user.endorsementsReceived.map(
								(endorsement) =>
									endorsement.softSkill ||
									endorsement.techSkill
							)
						).size === 10
					]}

					{#if badges[0]}
						<Badge name="Project Starter">
							<TenProjects
								slot="badge"
								class="w-12 h-12 shrink-0"
							/>

							Created 10+ public projects
						</Badge>
					{/if}

					{#if badges[1]}
						<Badge name="Project Master">
							<TwentyProjects
								slot="badge"
								class="w-12 h-12 shrink-0"
							/>

							Created 20+ public projects
						</Badge>
					{/if}

					{#if badges[2]}
						<Badge name="All Endorsed">
							<AllEndorsed
								slot="badge"
								class="w-12 h-12 shrink-0"
							/>

							Has all their skills endorsed
						</Badge>
					{/if}

					<!-- TODO: Kudos Badges -->

					{#if badges.every((badge) => !badge)}
						<h1 class="font-semibold text-xl m-auto">No Badges</h1>
					{/if}
				</ProfileSection>

				<!-- TODO: Add kudos -->
			</div>
		</div>
	</div>
</div>
