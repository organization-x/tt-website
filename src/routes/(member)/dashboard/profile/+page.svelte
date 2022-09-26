<script lang="ts">
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

	let original: PageParentData;

	export { original as data };

	// Since the data object is shared across all pages, we need to make a copy of it so
	// that unmade changes arent shown on other pages
	let data = JSON.parse(JSON.stringify(original)) as PageParentData;

	let disableForm = false;
	let disableButtons = true;

	const checkConstraints = () => {
		disableButtons = true;

		const about = data.user.about.trim();

		if (
			about.length > 150 ||
			data.user.positions.length < 2 ||
			data.user.softSkills.length < 2 ||
			data.user.techSkills.length < 2
		)
			return;

		console.log(original.user.about, data.user.about);
		// Check if the data has changed from its original content
		if (JSON.stringify(original) !== JSON.stringify(data))
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
		data.user.team = detail.selected as Team;
		checkConstraints();
	};

	$: data.user.about, checkConstraints();

	$: data.links,
		Object.keys(data.links).forEach((key) => {
			if (key === "userId") return;

			const link =
				data.links[key as keyof Links] &&
				data.links[key as keyof Links]!.trim();

			// @ts-ignore Typescript for some reason doesn't recognize my userId check earlier so it freaks out
			data.links[key as keyof Links] = link && link.length ? link : null;
		}),
		checkConstraints();

	// On cancel, revert the values to their originals and disable the save/cancel buttons
	const cancel = () => {
		disableButtons = true;
		data = JSON.parse(JSON.stringify(original));
	};

	const save = () => {
		disableForm = true;

		// Trim the about section
		data.user.about = data.user.about.trim();

		disableButtons = true;

		// Send an update request to the API
		fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					id: data.user.id
				},
				user: data.user,
				links: data.links
			} as App.UserUpdateRequest)
		}).then(() => {
			disableForm = false;

			// TODO: Original and data are somehow synced
			// TODO: Polish up dashboard experience

			// If successful, update the original data.
			// The reason it's done manually like this is so the original object is then still used across all dashboard pages
			// original.user.about = data.user.about;
			// original.user.team = data.user.team;
			// original.user.positions = data.user.positions;
			// original.user.softSkills = data.user.softSkills;
			// original.user.techSkills = data.user.techSkills;
			// original.links = data.links;
		});
	};
</script>

<div class="relative pt-[4.5rem] px-8 lg:px-12">
	<div class="grid absolute top-0 inset-x-0 -z-10">
		<!-- TODO: Replace placeholder -->
		<img
			src="/projects/project/placeholder/banner.webp"
			width="1920"
			height="1080"
			alt="{data.user.name}'s banner"
			class="object-cover object-center w-full h-32 row-start-1 col-start-1 lg:h-44"
		/>

		<button
			class="w-full h-full bg-black/40 flex justify-center items-center gap-2 row-start-1 col-start-1"
		>
			<Pencil class="w-6 h-6 lg:w-8 lg:h-8" />
			<h1 class="text-xl select-none font-semibold lg:text-2xl">Edit</h1>
		</button>
	</div>

	<div class="lg:flex lg:gap-12 lg:justify-center">
		<div
			class="flex flex-col gap-4 lg:shrink-0 lg:sticky lg:h-min lg:mt-10 lg:top-6 lg:w-52"
		>
			<div
				class="rounded-full w-fit border-4 mt-4 border-black mx-auto grid lg:mx-0"
			>
				<img
					src="/developers/user/placeholder/icon.webp"
					alt="{data.user.name}'s avatar"
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
				{data.user.name}
			</GradientText>

			<a
				target="_blank"
				rel="noopener noreferrer"
				href="/developers/{data.user.url}"
				class="px-4 py-3 rounded-lg bg-gray-500 flex items-center justify-center mx-auto w-full gap-4 max-w-xl lg:mx-0"
			>
				View Profile
				<ExternalLink class="w-6 h-6" />
			</a>
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
						bind:value={data.user.about}
						placeholder="Include previous projects, skills, and your experience level..."
						max={150}
					/>
					<Dropdown
						radio={true}
						options={teams}
						required={false}
						selectedItems={[data.user.team]}
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
						bind:value={data.links.GitHub}
						placeholder="GitHub username"
					>
						<GitHub class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={data.links.LinkedIn}
						placeholder="LinkedIn username"
					>
						<LinkedIn class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={data.links.Devto}
						placeholder="Dev.to username"
					>
						<Devto class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={data.links.Twitter}
						placeholder="Twitter username"
					>
						<Twitter class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={data.links.Facebook}
						placeholder="Facebook username"
					>
						<Facebook class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						bind:value={data.links.Website}
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
							selectedItems={data.user.positions}
							on:change={({ detail }) => {
								dropdownUpdate(
									data.user.positions,
									detail.selected,
									detail.previous
								);
								data.user.positions = data.user.positions;
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
								selectedItems={data.user.softSkills}
								on:change={({ detail }) => {
									dropdownUpdate(
										data.user.softSkills,
										detail.selected,
										detail.previous
									);
									data.user.softSkills = data.user.softSkills;
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
								selectedItems={data.user.techSkills}
								on:change={({ detail }) => {
									dropdownUpdate(
										data.user.techSkills,
										detail.selected,
										detail.previous
									);
									data.user.techSkills = data.user.techSkills;
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
