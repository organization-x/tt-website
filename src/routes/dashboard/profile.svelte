<script lang="ts">
	import GitHub from "$lib/components/icons/GitHub.svelte";
	import LinkedIn from "$lib/components/icons/LinkedIn.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Instagram from "$lib/components/icons/Instagram.svelte";
	import Panel from "$lib/components/developers/user/index/Panel.svelte";
	import Pencil from "$lib/components/icons/Pencil.svelte";
	import ProfileSection from "$lib/components/dashboard/profile/ProfileSection.svelte";
	import Input from "$lib/components/dashboard/profile/Input.svelte";
	import Wrench from "$lib/components/icons/Wrench.svelte";
	import Devto from "$lib/components/icons/Devto.svelte";
	import Twitter from "$lib/components/icons/Twitter.svelte";
	import Facebook from "$lib/components/icons/Facebook.svelte";
	import LinkIcon from "$lib/components/icons/LinkIcon.svelte";
</script>

<div class="relative pt-[4.5rem] px-4">
	<!-- TODO: Switch banner/icon to proper defaults. Right now its set to the banner because its bright and easy to differentiate -->

	<div
		class="h-32 absolute inset-0 bottom-auto bg-cover bg-center -z-10"
		style="background-image: url(/projects/project/placeholder/banner.webp);"
	>
		<div
			class="absolute inset-0 bg-black/40 flex justify-center items-center gap-2"
		>
			<Pencil class="w-6 h-6" />
			<h1 class="text-xl font-semibold">Edit</h1>
		</div>
	</div>

	<div class="rounded-full w-fit border-4 mt-4 border-black mx-auto relative">
		<img
			src="/projects/project/placeholder/banner.webp"
			alt="Profile"
			class="w-28 h-28 rounded-full"
		/>
		<div class="absolute inset-0 bg-black/40 rounded-full flex">
			<Pencil class="w-7 h-7 m-auto" />
		</div>
	</div>

	<GradientText
		class="from-green-light to-green-dark font-bold text-3xl text-center w-full"
	>
		Jackson Choyce
	</GradientText>

	<div class="flex flex-col px-4 mt-8 gap-12">
		<ProfileSection direction="bg-gradient-to-br" title="About Me">
			<textarea
				type="text"
				class="w-full h-72 bg-gray-500/40 resize-none flex p-4 rounded-lg select-none focus:outline-none"
				placeholder="Include previous projects, skills, and your experience level..."
				maxlength="150"
			/>
			<Input placeholder="Position">
				<Wrench class="w-6 h-6 mx-auto" />
			</Input>
		</ProfileSection>

		<ProfileSection direction="bg-gradient-to-br" title="Links">
			<Input placeholder="GitHub username">
				<GitHub class="w-6 h-6 mx-auto" />
			</Input>
			<Input placeholder="LinkedIn username">
				<LinkedIn class="w-6 h-6 mx-auto" />
			</Input>
			<Input placeholder="Dev.to username">
				<Devto class="w-6 h-6 mx-auto" />
			</Input>
			<Input placeholder="Twitter username">
				<Twitter class="w-6 h-6 mx-auto" />
			</Input>
			<Input placeholder="Facebook username">
				<Facebook class="w-6 h-6 mx-auto" />
			</Input>
			<Input placeholder="Website link">
				<LinkIcon class="w-6 h-6 mx-auto" />
			</Input>
		</ProfileSection>
	</div>
</div>
