<script lang="ts">
	import { user as original } from "$lib/stores";
	import Devto from "$lib/components/icons/Devto.svelte";
	import Group from "$lib/components/icons/Group.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import GitHub from "$lib/components/icons/GitHub.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import Twitter from "$lib/components/icons/Twitter.svelte";
	import Input from "$lib/components/dashboard/Input.svelte";
	import LinkedIn from "$lib/components/icons/LinkedIn.svelte";
	import Facebook from "$lib/components/icons/Facebook.svelte";
	import LinkIcon from "$lib/components/icons/LinkIcon.svelte";
	import ShowHide from "$lib/components/icons/ShowHide.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import TextBox from "$lib/components/dashboard/TextBox.svelte";
	import ExternalLink from "$lib/components/icons/ExternalLink.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import { teams, positions, softSkills, techSkills } from "$lib/enums";
	import ProfileSection from "$lib/components/dashboard/profile/ProfileSection.svelte";

	import type { PageParentData } from "./$types";
	import type {
		Position,
		SoftSkill,
		TechSkill,
		Team,
		Links
	} from "@prisma/client";

	// Since the data object is shared across all pages, we need to make a copy of it so
	// that unmade changes arent shown on other pages
	let user = JSON.parse(JSON.stringify($original)) as PageParentData;

	let disableForm = false;
	let disableButtons = true;
	let visible = $original.visible;

	const checkConstraints = () => {
		// If the form is disabled ignore since the reactive statements fire due to the fetch call
		if (disableForm) return;

		disableButtons = true;

		const about = user.about.trim();

		if (
			about.length > 150 ||
			user.positions.length < 2 ||
			user.softSkills.length < 2 ||
			user.techSkills.length < 2
		)
			return;

		// Check if the data has changed from its original content
		if (JSON.stringify($original) !== JSON.stringify(user))
			disableButtons = false;
	};

	// For updating dropdown arrays
	const dropdownUpdate = <T extends Position | SoftSkill | TechSkill>(
		array: T[],
		selected: string,
		previous: string
	) => {
		const index = array.indexOf(previous as T);

		// If the newly selected value is the same ignore
		if (array[index] === selected) return;

		// If there is a found value for that dropdown, and a selected value then update it, otherwise delete it.
		// If there isn't a found value for that dropdown then push it to the array.
		if (index !== -1) {
			selected ? (array[index] = selected as T) : array.splice(index, 1);
		} else if (selected) array.push(selected as T);

		checkConstraints();
	};

	const updateTeam = ({
		detail
	}: CustomEvent<{ selected: string; previous: string }>) => {
		user.team = detail.selected as Team;
		checkConstraints();
	};

	$: user.about, checkConstraints();

	$: user.links,
		Object.keys(user.links).forEach((key) => {
			if (key === "userId") return;

			const link =
				user.links[key as keyof Links] &&
				user.links[key as keyof Links]!.trim();

			// @ts-ignore Typescript for some reason doesn't recognize my userId check earlier so it freaks out
			user.links[key as keyof Links] = link && link.length ? link : null;
		}),
		checkConstraints();

	// On cancel, revert the values to their originals and disable the save/cancel buttons
	const cancel = () => {
		disableButtons = true;
		user = JSON.parse(JSON.stringify($original));
	};

	const save = () => {
		checkConstraints();

		if (disableButtons || disableForm) return;

		disableForm = true;

		// Trim the about section
		user.about = user.about.trim();

		disableButtons = true;

		fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: { id: user.id },
				user
			} as App.UserUpdateRequest)
		}).then(() => {
			disableForm = false;

			// If successful, update the original data.
			// The reason it's done manually like this is so the original object is presevered and is then used across all dashboard pages
			original.set(user);
		});
	};

	// Update visility of user
	const toggleVisible = () => {
		fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: { id: $original.id },
				user: { visible }
			} as App.UserUpdateRequest)
		}).then(() => ($original.visible = visible));
	};

	// When the user does CTRL/CMD + S, save the data
	const onKeydown = (e: KeyboardEvent) => {
		if (e.metaKey && e.key === "s") {
			e.preventDefault();
			save();
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<div class="relative pt-[4.5rem] px-8 lg:px-10">
	<div class="grid absolute top-0 inset-x-0 -z-10">
		<!-- TODO: Replace placeholder -->
		<img
			src="/assets/projects/project/placeholder/banner.webp"
			width="1920"
			height="1080"
			alt="{user.name}'s banner"
			class="object-cover object-center w-full h-32 row-start-1 col-start-1 lg:h-44"
		/>

		<button
			class="w-full h-full bg-black/40 flex justify-center items-center gap-2 row-start-1 col-start-1"
		>
			<Pencil class="w-6 h-6 lg:w-8 lg:h-8" />
			<h1 class="text-xl select-none font-semibold lg:text-2xl">Edit</h1>
		</button>
	</div>

	<div class="lg:flex lg:gap-8 lg:justify-center">
		<div
			class="flex flex-col gap-4 lg:shrink-0 lg:sticky lg:h-min lg:mt-10 lg:top-6 lg:w-60"
		>
			<div
				class="rounded-full w-fit border-4 mt-4 border-black mx-auto grid lg:mx-0"
			>
				<img
					width="200"
					height="200"
					src="/assets/developers/user/placeholder/icon.webp"
					alt="{user.name}'s avatar"
					class="w-28 h-28 rounded-full row-start-1 col-start-1 lg:w-32 lg:h-32"
				/>
				<div
					class="bg-black/40 rounded-full flex row-start-1 col-start-1"
				>
					<Pencil class="w-7 h-7 m-auto" />
				</div>
			</div>

			<GradientText
				class="from-green-light to-green-dark font-bold text-3xl text-center w-full lg:text-start"
			>
				{user.name}
			</GradientText>

			<div class="flex gap-4 w-full mx-auto max-w-xl lg:mx-0">
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="/developers/{user.url}"
					class="px-4 py-3 rounded-lg bg-gray-500 flex items-center justify-center gap-4 w-full"
				>
					View Profile
					<ExternalLink class="w-6 h-6" />
				</a>

				<DashButton
					icon={true}
					on:click={() => (visible = !visible)}
					debounce={{
						bind: visible,
						func: toggleVisible,
						delay: 300
					}}
					class="bg-gray-500 w-fit"
				>
					<ShowHide class="w-5 h-5" crossed={visible} />
				</DashButton>
			</div>
		</div>

		<div
			disabled={disableForm}
			class:opacity-60={disableForm}
			class:pointer-events-none={disableForm}
			class="flex flex-col mt-8 gap-12 max-w-screen-2xl mx-auto transition-opacity duration-300 lg:mt-40 lg:mx-0 3xl:grid 3xl:grid-cols-2 3xl:text-sm"
		>
			<div class="flex flex-col gap-12 justify-between">
				<ProfileSection direction="bg-gradient-to-br" title="About Me">
					<TextBox
						bind:value={user.about}
						placeholder="Include previous projects, skills, and your experience level..."
						max={150}
					/>
					<Dropdown
						radio={true}
						options={teams}
						required={false}
						selectedItems={[user.team]}
						on:change={updateTeam}
					>
						<Group class="w-8 h-8 shrink-0" />
					</Dropdown>
				</ProfileSection>

				<ProfileSection
					direction="bg-gradient-to-tr"
					largeGrid={true}
					title="Links"
				>
					<Input
						bind:value={user.links.GitHub}
						placeholder="GitHub username"
					>
						<GitHub class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={user.links.LinkedIn}
						placeholder="LinkedIn username"
					>
						<LinkedIn class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={user.links.Devto}
						placeholder="Dev.to username"
					>
						<Devto class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={user.links.Twitter}
						placeholder="Twitter username"
					>
						<Twitter class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={user.links.Facebook}
						placeholder="Facebook username"
					>
						<Facebook class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={user.links.Website}
						placeholder="Website link"
					>
						<LinkIcon class="w-6 h-6 mx-auto" />
					</Input>
				</ProfileSection>
			</div>

			<div class="flex flex-col gap-12 justify-between">
				<ProfileSection
					direction="bg-gradient-to-tl"
					largeGrid={true}
					title="Positions"
				>
					{#each { length: 4 } as _, i}
						<Dropdown
							{i}
							radio={true}
							required={i < 2}
							options={positions}
							selectedItems={user.positions}
							on:change={({ detail }) => {
								dropdownUpdate(
									user.positions,
									detail.selected,
									detail.previous
								);
								user.positions = user.positions;
							}}
						/>
					{/each}
				</ProfileSection>

				<ProfileSection
					direction="bg-gradient-to-bl"
					largeGrid={true}
					title="Skills"
				>
					<div class="flex flex-col gap-6">
						<h1 class="font-semibold text-xl text-center">Soft</h1>
						{#each { length: 5 } as _, i}
							<Dropdown
								{i}
								radio={true}
								required={i < 2}
								options={softSkills}
								selectedItems={user.softSkills}
								on:change={({ detail }) => {
									dropdownUpdate(
										user.softSkills,
										detail.selected,
										detail.previous
									);
									user.softSkills = user.softSkills;
								}}
							/>
						{/each}
					</div>
					<div class="flex flex-col gap-6">
						<h1 class="font-semibold text-xl text-center">
							Technical
						</h1>
						{#each { length: 5 } as _, i}
							<Dropdown
								{i}
								radio={true}
								required={i < 2}
								options={techSkills}
								selectedItems={user.techSkills}
								on:change={({ detail }) => {
									dropdownUpdate(
										user.techSkills,
										detail.selected,
										detail.previous
									);
									user.techSkills = user.techSkills;
								}}
							/>
						{/each}
					</div>
				</ProfileSection>
			</div>

			<div class="flex gap-6 mx-auto lg:mr-0 xl:col-span-2">
				<DashButton
					on:click={cancel}
					disabled={disableButtons}
					class="bg-gray-500"
				>
					Cancel
				</DashButton>
				<DashButton
					on:click={save}
					disabled={disableButtons}
					class="bg-blue-light"
				>
					Save
				</DashButton>
			</div>
		</div>
	</div>
</div>
