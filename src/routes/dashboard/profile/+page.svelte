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

	// TODO: Add proper profile picture and banner stuff using cloudflare images

	import type { PageData } from "./$types";
	import type { Position, SoftSkill, TechSkill, Links } from "@prisma/client";

	// Use fetched user data and store an original copy for comparison and revertion
	export let data: PageData;
	let { user, links } = data;
	let original = JSON.parse(JSON.stringify(data)) as PageData; // This is a way to deep clone the object easily

	let disableButtons = true;
	let disableForm = false;

	const onSave = async () => {
		disableButtons = true;
		disableForm = true;

		// Send an update request to the API
		await fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					id: user.id
				},
				user,
				links,
				authored: null
			} as App.UserUpdateRequest)
		})
			.then(() => {
				disableForm = false;

				// If successful, update the original data
				original = JSON.parse(JSON.stringify(data)) as PageData;
			})
			.catch(); // If an error occurs, most likely a very old page that's open, so ignore it and never enable the form
	};

	// On cancel, revert the values to their originals and disable the save/cancel buttons
	const onCancel = () => {
		disableButtons = true;
		links = JSON.parse(JSON.stringify(original.links));
		user = JSON.parse(JSON.stringify(original.user));
	};

	// For updating dropdown arrays
	const updateSelected = (
		array: (Position | SoftSkill | TechSkill)[],
		selected: Position | SoftSkill | TechSkill,
		index: number
	) => {
		// If the newly selected value is the same ignore
		if (array[index] === selected) return false;

		// If there is a found value for that dropdown, and a selected value then update it, otherwise delete it.
		// If there isn't a found value for that dropdown then push it to the array.
		if (index !== -1) {
			selected ? (array[index] = selected) : array.splice(index, 1);
		} else if (selected) array.push(selected);

		return true;
	};

	// Handle dropdown selection and input changes
	const onChange = (
		id:
			| "about"
			| "team"
			| "positions"
			| keyof Links
			| "softSkills"
			| "techSkills",
		event: Event
	) => {
		const target = event.target! as HTMLInputElement;
		const { detail } = event as CustomEvent;

		disableButtons = true;

		switch (id) {
			case "about":
				user.about = target.value;

				break;
			case "team":
				user.team = detail.selected || null;

				break;
			case "GitHub":
			case "LinkedIn":
			case "Devto":
			case "Twitter":
			case "Facebook":
			case "Website":
				const value = target.value.trim();

				links[id] = value.length ? value : null;

				break;

			// The reassignment you see here is to update components on an array change
			case "positions":
				if (
					updateSelected(
						user.positions,
						detail.selected,
						user.positions.indexOf(detail.previous)
					)
				)
					user.positions = user.positions;

				break;
			case "softSkills":
				if (
					updateSelected(
						user.softSkills,
						detail.selected,
						user.softSkills.indexOf(detail.previous)
					)
				)
					user.softSkills = user.softSkills;

				break;
			case "techSkills":
				if (
					updateSelected(
						user.techSkills,
						detail.selected,
						user.techSkills.indexOf(detail.previous)
					)
				)
					user.techSkills = user.techSkills;

				break;
		}

		// Check constraints, input validation
		if (
			user.about.length > 150 || // About me length check
			user.positions.length < 2 || // Dropdown length checks
			user.softSkills.length < 2 ||
			user.techSkills.length < 2
		)
			return;

		// Check if the data has changed from its original content
		if (JSON.stringify(original) !== JSON.stringify(data))
			disableButtons = false; // Enable save/cancel button
	};
</script>

<div class="relative pt-[4.5rem] px-8 lg:px-12">
	<!-- TODO: Switch banner/profile pictures to correct sources  -->

	<div
		class="h-32 absolute inset-0 bottom-auto bg-cover bg-center -z-10 lg:h-44"
		style="background-image: url(/developers/user/placeholder/banner.webp)"
	>
		<div
			class="absolute inset-0 bg-black/40 flex justify-center items-center gap-2"
		>
			<Pencil class="w-6 h-6 lg:w-8 lg:h-8" />
			<h1 class="text-xl select-none font-semibold lg:text-2xl">Edit</h1>
		</div>
	</div>

	<div class="lg:flex lg:gap-12 lg:justify-center">
		<div
			class="flex flex-col gap-4 lg:shrink-0 lg:sticky lg:h-min lg:mt-10 lg:top-6"
		>
			<div
				class="rounded-full w-fit border-4 mt-4 border-black mx-auto relative lg:mx-0"
			>
				<img
					src="/developers/user/placeholder/icon.webp"
					alt="{user.name}'s avatar"
					class="w-28 h-28 rounded-full lg:w-32 lg:h-32"
				/>
				<div class="absolute inset-0 bg-black/40 rounded-full flex">
					<Pencil class="w-7 h-7 m-auto" />
				</div>
			</div>

			<GradientText
				class="from-green-light to-green-dark font-bold text-3xl text-center w-full lg:text-start"
			>
				{user.name}
			</GradientText>

			<a
				target="_blank"
				rel="noopener noreferrer"
				href="/developers/{user.url}"
				class="px-4 py-3 select-none rounded-lg bg-gray-500 flex items-center justify-center mx-auto w-full gap-4 max-w-xl lg:mx-0"
			>
				View Profile
				<ExternalLink class="w-6 h-6" />
			</a>
		</div>

		<div
			disabled={disableForm}
			class:pointer-events-none={disableForm}
			class:opacity-60={disableForm}
			class="flex flex-col mt-8 gap-12 max-w-screen-2xl mx-auto transition-opacity duration-300 lg:mt-40 lg:mx-0 3xl:grid 3xl:grid-cols-2 3xl:text-sm"
		>
			<div class="flex flex-col gap-12 justify-between">
				<ProfileSection direction="bg-gradient-to-br" title="About Me">
					<TextBox
						on:input={(e) => onChange("about", e)}
						value={user.about}
						placeholder="Include previous projects, skills, and your experience level..."
						max={150}
					/>
					<Dropdown
						radio={true}
						options={teams}
						required={false}
						selectedItems={[user.team]}
						on:change={(e) => onChange("team", e)}
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
						on:input={(e) => onChange("GitHub", e)}
						value={links["GitHub"]}
						placeholder="GitHub username"
					>
						<GitHub class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						on:input={(e) => onChange("LinkedIn", e)}
						value={links["LinkedIn"]}
						placeholder="LinkedIn username"
					>
						<LinkedIn class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						on:input={(e) => onChange("Devto", e)}
						value={links["Devto"]}
						placeholder="Dev.to username"
					>
						<Devto class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						on:input={(e) => onChange("Twitter", e)}
						value={links["Twitter"]}
						placeholder="Twitter username"
					>
						<Twitter class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						on:input={(e) => onChange("Facebook", e)}
						value={links["Facebook"]}
						placeholder="Facebook username"
					>
						<Facebook class="w-6 h-6 mx-auto" />
					</Input>
					<Input
						on:input={(e) => onChange("Website", e)}
						value={links["Website"]}
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
							on:change={(e) => onChange("positions", e)}
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
								on:change={(e) => onChange("softSkills", e)}
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
								on:change={(e) => onChange("techSkills", e)}
							/>
						{/each}
					</div>
				</ProfileSection>
			</div>

			<div class="flex gap-6 mx-auto lg:mr-0 xl:col-span-2">
				<DashButton
					on:click={onCancel}
					disabled={disableButtons}
					class="bg-gray-500"
				>
					Cancel
				</DashButton>
				<DashButton
					on:click={onSave}
					disabled={disableButtons}
					class="bg-blue-light"
				>
					Save
				</DashButton>
			</div>
		</div>
	</div>
</div>
