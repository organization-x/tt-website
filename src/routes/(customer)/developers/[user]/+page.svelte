<script lang="ts">
	import { getContext, onMount } from "svelte";
	import { fly, slide } from "svelte/transition";

	import Badge from "./Badge.svelte";
	import Skill from "./Skill.svelte";
	import { breadcrumb } from "$lib/seo";
	import { getIcon } from "$lib/getIcon";
	import { DateOption } from "$lib/enums";
	import { developers } from "$lib/stores";
	import Kudo from "$lib/components/Kudo.svelte";
	import Plus from "$lib/icons/general/Plus.svelte";
	import DevTag from "$lib/components/DevTag.svelte";
	import ProjectSection from "./ProjectSection.svelte";
	import TenKudos from "$lib/icons/badges/TenKudos.svelte";
	import Question from "$lib/icons/general/Question.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import FiftyKudos from "$lib/icons/badges/FiftyKudos.svelte";
	import KudoLoading from "$lib/components/KudoLoading.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import DateDropdown from "$lib/components/DateDropdown.svelte";
	import TenProjects from "$lib/icons/badges/TenProjects.svelte";
	import AllEndorsed from "$lib/icons/badges/AllEndorsed.svelte";
	import HundredKudos from "$lib/icons/badges/HundredKudos.svelte";
	import ProfileSection from "$lib/components/ProfileSection.svelte";
	import TwentyProjects from "$lib/icons/badges/TwentyProjects.svelte";

	import type { PageData } from "./$types";
	import type { Writable } from "svelte/store";
	import type { SoftSkill, TechSkill } from "@prisma/client";

	export let data: PageData;

	// There are two variables in this context holding using data, one being userPage which holds the data
	// of the user that someone has navigated to, and user, the user currently logged in if any

	// Store the badge booleans in an array so we can figure out if the user has earned a badge
	const badges = [
		data.projects.length >= 10,
		data.projects.length >= 20,
		new Set(
			data.userPage.endorsementsReceived.map(
				(endorsement) => endorsement.softSkill || endorsement.techSkill
			)
		).size === 10
	];

	// Create a new scope so the kudo counts are dropped once assigned to the badges array
	{
		// Get kudos counts from the last month, six months and twelve months for badges
		const [month, sixMonths, twelveMonths] = data.kudos.reduce(
			(
				result: [
					number,
					number,
					number,
					null | Date,
					null | Date,
					null | Date
				],
				kudo,
				i
			) => {
				// If it is the first iteration, assign the date variables for filtering
				if (!i) {
					const month = new Date();
					const sixMonths = new Date();
					const twelveMonths = new Date();

					month.setMonth(month.getMonth() - 1);
					sixMonths.setMonth(sixMonths.getMonth() - 6);
					twelveMonths.setMonth(twelveMonths.getMonth() - 12);

					result[3] = month;
					result[4] = sixMonths;
					result[5] = twelveMonths;
				}

				if (kudo.timestamp >= result[3]!) result[0]++;
				if (kudo.timestamp >= result[4]!) result[1]++;
				if (kudo.timestamp >= result[5]!) result[2]++;

				return result;
			},
			[0, 0, 0, null, null, null]
		);

		badges[3] = month >= 10;
		badges[4] = sixMonths >= 50;
		badges[5] = twelveMonths >= 100;
	}

	const timestamp = getContext("timestamp") as string;
	const tabindex = getContext<Writable<number>>("tabindex");

	// Keep track of whether the developer saving help section is open
	let helpOpen = false;

	// Keep track of the current projects being endorsed by the current user so
	// animations play correctly
	let endorsingSkills = new Set<TechSkill | SoftSkill>();

	// Make links into an array of objects with the link name and the link if it exists
	const links = Object.entries(data.userPage.links)
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
				return link.startsWith("http://") || link.startsWith("https://")
					? link
					: `https://${link}`;
		}
	};

	// Construct an endorsements object with each skill the user has selected as a property
	let endorsements = Object.fromEntries(
		[...data.userPage.techSkills, ...data.userPage.softSkills].map(
			(skill) => [skill, []]
		)
	) as Record<string, { id: number; from: App.Endorser }[]>;

	// Add each endorsement to the correct skill
	data.userPage.endorsementsReceived.forEach((endorsement) =>
		endorsements[(endorsement.softSkill || endorsement.techSkill)!].push({
			id: endorsement.id,
			from: endorsement.from
		})
	);

	// Add/remove endorsements from this user
	const updateEndorsements = async (
		skill: TechSkill | SoftSkill,
		endorsing: boolean,
		type: "softSkill" | "techSkill"
	) => {
		if (!data.user) return;

		// Mark this skill as being endorsed
		endorsingSkills.add(skill);

		// Re-assign for re-render
		endorsingSkills = endorsingSkills;

		// If the endorsement is being added then supply the user ID of whom it is being added
		// to, otherwise supply the ID of the endorsement being removed
		const id = endorsing
			? data.userPage.id
			: endorsements[skill].find(
					(endorsement) => endorsement.from.id === data.user!.id
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

	let kudos: App.Kudo[] = [];

	// Store the selected start and end dates for kudos filtering
	let dates: { startDate: Date | null; endDate: Date | null } = {
		startDate: null,
		endDate: null
	};

	// As the user scrolls, more kudos will load dynamically so keep track of the page
	// and the total of amount pages
	let page = 1;
	let pages = 0;

	// Keep track of the current request so that we don't fetch pages while another is still loading
	let request: Promise<void> | null = new Promise(() => {});

	// Keep track of whether this request is because of scrolling or because of a date switch
	let scroll = false;

	// Filter kudos data based on date selected
	const onSearch = () => {
		const query = fetch(
			`/api/kudos?id=${
				data.userPage.id
			}&startDate=${dates.startDate!.toISOString()}&endDate=${dates.endDate!.toISOString()}&mode=personal&page=${page}`
		)
			.then((res) => res.json())
			.then((data: App.KudosResponse) => {
				if (page > 1) kudos = [...kudos, ...data.kudos];
				else kudos = data.kudos;

				pages = data.pages;
				request = null;
				scroll = false;
			});

		// If this is a scroll request dont have the top level await
		// destroy all the components, instead just play the loading animation
		// at the end of the scroll
		request = scroll ? null : query;
	};

	// Add analytics tracking for user views
	onMount(async () => {
		if (!data.track) return;

		import("$lib/analytics")
			.then(
				async ({ analytics }) =>
					await await analytics.track("user_view", {
						id: data.userPage.id
					})
			)
			.catch(() => {});
	});
</script>

<svelte:head>
	<title>{data.userPage.name} / Team Tomorrow</title>

	<meta name="description" content={data.userPage.about} />

	<!-- OpenGraph data with user info -->
	<meta property="og:title" content="{data.userPage.name} / Team Tomorrow" />
	<meta name="og:description" content={data.userPage.about} />
	<meta
		name="og:image"
		content="{PUBLIC_CLOUDFLARE_URL}/avatar-{data.userPage.id}/avatar"
	/>
	<meta
		name="og:image:secure_url"
		content="{PUBLIC_CLOUDFLARE_URL}/avatar-{data.userPage.id}/avatar"
	/>
	<meta name="og:image:width" content="512" />
	<meta name="og:image:height" content="512" />
	<meta name="og:image:alt" content="{data.userPage.name}'s avatar" />

	<!-- Twitter card data with user info -->
	<meta
		property="twitter:title"
		content="{data.userPage.name} / Team Tomorrow"
	/>
	<meta name="twitter:description" content={data.userPage.about} />
	<meta name="twitter:card" content="summary" />
	<meta
		name="twitter:image"
		content="{PUBLIC_CLOUDFLARE_URL}/avatar-{data.userPage.id}/avatar"
	/>

	{@html breadcrumb(data.userPage.name, data.userPage.url, "developers")}
</svelte:head>

<div class="relative pt-18 px-4 lg:px-10">
	<img
		src="{PUBLIC_CLOUDFLARE_URL}/banner-{data.userPage
			.id}/banner?{timestamp}"
		width="1920"
		height="1080"
		alt="{data.userPage.name}'s banner"
		class="-z-10 absolute bg-gray-400 top-0 inset-0 object-cover object-center w-full h-32 lg:h-44"
	/>

	<div
		class="mx-auto max-w-xl lg:flex lg:gap-10 lg:justify-between lg:max-w-screen-lg lg:mx-auto 3xl:max-w-screen-3xl"
	>
		<div
			class="mb-8 max-w-sm mx-auto flex flex-col gap-2 items-center lg:mt-10 lg:mb-0 lg:flex-col lg:items-start lg:sticky lg:top-2 lg:mx-0 lg:h-fit"
		>
			<img
				width="512"
				height="512"
				src="{PUBLIC_CLOUDFLARE_URL}/avatar-{data.userPage
					.id}/avatar?{timestamp}"
				alt="{data.userPage.name}'s avatar"
				class="border-4 mt-4 border-black bg-gray-400 box-content object-cover object-center w-28 h-28 rounded-full lg:w-32 lg:mx-0 lg:h-32 lg:mb-2 lg:-ml-[4px]"
			/>

			<h1 class="font-semibold text-lg text-center lg:text-start">
				{data.userPage.role !== "User" ? `${data.userPage.role} /` : ""}
				{data.userPage.team || "No Team"}
			</h1>

			<GradientText
				class="from-green-light to-green-dark text-center font-bold text-3xl lg:text-start lg:max-w-[15rem]"
			>
				{data.userPage.name}
			</GradientText>

			<p class="mx-auto my-2 break-words w-full lg:w-64 lg:mx-0">
				{data.userPage.about}
			</p>

			{#if links.length}
				<div
					class="py-3 w-full flex items-center justify-center gap-6 lg:justify-start lg:gap-4"
				>
					{#each links as { link, key } (key)}
						<a
							href={createLink(key, link)}
							rel="noopener noreferrer"
							tabindex={$tabindex}
							target="_blank"
						>
							<svelte:component
								this={getIcon(key)}
								class="w-6 h-6"
							/>
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<div
			class="max-w-md mx-auto lg:min-w-[28rem] lg:mt-40 lg:mb-10 3xl:min-w-[58rem] 3xl:relative 3xl:mb-16"
		>
			{#if !data.user}
				{@const saved =
					$developers &&
					$developers.some(({ id }) => data.userPage.id === id)}

				<div
					class:bg-white={saved}
					class:text-black={saved}
					class:bg-gray-900={!saved}
					class="mb-9 rounded-lg bg-gray-900 w-full py-4 px-5 text-lg transition-colors duration-200 3xl:w-1/2"
					aria-expanded={helpOpen}
					aria-checked={saved}
				>
					<div class="flex justify-end items-center relative gap-4">
						<div
							class:opacity-0={helpOpen}
							class:delay-75={!helpOpen}
							class:pointer-events-none={helpOpen}
							class="transition-opacity"
						>
							<h1
								class:opacity-0={!saved}
								class:delay-[50ms]={saved}
								class="transition-opacity absolute left-0"
							>
								Saved
							</h1>

							<h1
								class:opacity-0={saved}
								class:delay-[50ms]={!saved}
								class="transition-opacity absolute left-0"
							>
								Save Developer
							</h1>

							<button
								on:click={() => (helpOpen = true)}
								class="transition-opacity"
								tabindex={$tabindex}
							>
								<Question class="w-4 h-4" />
							</button>
						</div>

						<button
							on:click={() => {
								// If the help menu is open treat this as the close button
								if (helpOpen) return (helpOpen = false);

								// Either remove or add this developer to the list based on if they're
								// already on it or not
								const index = $developers.findIndex(
									({ id }) => id === data.userPage.id
								);

								index > -1
									? $developers.splice(index, 1) &&
									  ($developers = $developers)
									: ($developers = [
											...$developers,
											{
												id: data.userPage.id,
												name: data.userPage.name,
												url: data.userPage.url
											}
									  ]);
							}}
							class="z-20"
						>
							<Plus
								class="w-4 h-4 transition-transform{saved ||
								helpOpen
									? ' rotate-45'
									: ''}"
							/>
						</button>
					</div>

					{#if helpOpen}
						<div
							transition:slide={{ duration: 200 }}
							class="-mt-7 z-10"
						>
							<h1 class="font-semibold">
								What is developer saving?
							</h1>

							<p class="mt-1">
								Developer saving allows you to keep track of who
								you are interested in the most. Once you are on
								the contact page, you'll have access to your
								list and will be easily able to add them onto
								the form, allowing us to see who you want to
								recruit.
							</p>
						</div>
					{/if}
				</div>
			{/if}

			<div class="flex flex-col gap-8 mb-8 3xl:w-1/2 3xl:mb-0">
				<ProfileSection title="Positions">
					{#each data.userPage.positions as name (name)}
						<DevTag {name} lightBg={false} />
					{/each}
				</ProfileSection>

				<ProjectSection
					projects={data.projects}
					pinnedProject={data.userPage.pinnedProject}
					userId={data.userPage.id}
				/>

				<ProfileSection
					title="Badges"
					minHeight={!badges.includes(true)}
				>
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

					{#if badges[3]}
						<Badge name="Kudo Starter">
							<TenKudos slot="badge" class="w-12 h-12 shrink-0" />

							Got 10 kudos in the last month
						</Badge>
					{/if}

					{#if badges[4]}
						<Badge name="Kudo Master">
							<FiftyKudos
								slot="badge"
								class="w-12 h-12 shrink-0"
							/>

							Got 50 kudos in the last six months
						</Badge>
					{/if}

					{#if badges[5]}
						<Badge name="Kudo Legend">
							<HundredKudos
								slot="badge"
								class="w-12 h-12 shrink-0"
							/>

							Got 100 kudos in the last 12 months
						</Badge>
					{/if}

					{#if !badges.includes(true)}
						<h1 class="font-semibold text-xl m-auto">No Badges</h1>
					{/if}
				</ProfileSection>
			</div>

			<div
				class="flex flex-col gap-8 w-full 3xl:absolute 3xl:inset-0 3xl:left-1/2 3xl:w-1/2 3xl:pl-10"
			>
				<ProfileSection title="Top Skills">
					{@const endorser =
						data.user && data.user.id !== data.userPage.id
							? data.user.id
							: null}

					<div class="flex flex-col gap-6">
						<h1 class="font-semibold text-xl text-center">Soft</h1>

						{#each data.userPage.softSkills as name (name)}
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

						{#each data.userPage.techSkills as name (name)}
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

				<div
					class="w-full mx-auto lg:max-w-screen-xl 3xl:min-h-0 3xl:flex 3xl:flex-col 3xl:flex-1"
				>
					<h1 class="text-2xl font-semibold ml-1">Kudos</h1>

					<div
						class="bg-gray-900 p-4 rounded-lg flex flex-col gap-6 mt-4 3xl:flex-1 3xl:min-h-0"
					>
						<DateDropdown
							profile={true}
							on:search={({ detail }) => {
								page = 1;
								scroll = false;

								// Set the promise so it will show the animation
								request = new Promise(() => {});

								const startDate =
									detail.selected === DateOption.Custom
										? detail.custom
										: new Date();

								switch (detail.selected) {
									case DateOption.Week:
										startDate.setDate(
											startDate.getDate() - 7
										);

										break;
									case DateOption.Month:
										startDate.setMonth(
											startDate.getMonth() - 1
										);

										break;
									case DateOption.Half:
										startDate.setMonth(
											startDate.getMonth() - 6
										);

										break;
									case DateOption.Year:
										startDate.setFullYear(
											startDate.getFullYear() - 1
										);
								}

								dates.startDate = startDate;
								dates.endDate =
									detail.selected === DateOption.Custom
										? detail.custom
										: new Date();

								onSearch();
							}}
						/>

						<Scrollable
							on:scroll={({ detail: scrollable }) =>
								!request &&
								!scroll &&
								kudos.length &&
								pages > 1 &&
								page + 1 <= pages &&
								scrollable.scrollTop / scrollable.clientHeight >
									0.5 &&
								(page += 1) &&
								(scroll = true) &&
								onSearch()}
							vertical={true}
							class="h-120 before:from-gray-900 after:to-gray-900 md:h-[28rem] 3xl:h-full"
							innerClass="scrollbar-hidden gap-10 pt-4"
						>
							{#await request}
								{#each { length: 10 } as _}
									<KudoLoading />
								{/each}
							{:then}
								{#if kudos.length}
									{#each kudos as kudo (kudo)}
										<Kudo {kudo} />
									{/each}

									{#if scroll}
										{#each { length: 10 } as _}
											<KudoLoading />
										{/each}
									{/if}
								{:else}
									<h1
										in:fly={{
											duration: 300,
											y: 30,
											delay: 300
										}}
										class="font-semibold text-xl text-center mt-2"
									>
										No Kudos
									</h1>
								{/if}
							{/await}
						</Scrollable>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
