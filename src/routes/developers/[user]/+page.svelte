<script lang="ts">
	import { page } from "$app/stores";

	import GitHub from "$lib/components/icons/GitHub.svelte";
	import LinkedIn from "$lib/components/icons/LinkedIn.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Instagram from "$lib/components/icons/Instagram.svelte";
	import Panel from "$lib/components/developers/user/index/Panel.svelte";

	const user = $page.params.user; // Slug passed in for retrieving user data
</script>

<div class="relative pt-[4.5rem] px-4">
	<!-- TODO: Switch banner/icon to proper defaults. Right now its set to the banner because its bright and easy to differentiate -->

	<div
		class="h-32 absolute inset-0 bottom-auto bg-cover bg-center -z-10"
		style="background-image: url(/projects/project/placeholder/banner.webp);"
	/>

	<img
		src="/projects/project/placeholder/banner.webp"
		alt="Profile"
		class="w-28 h-28 rounded-full border-4 border-black mx-auto"
	/>

	<div class="flex flex-col gap-4 mt-2 pl-2">
		<GradientText
			class="from-green-light to-green-dark font-bold text-3xl text-center"
		>
			Jackson Choyce
		</GradientText>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum natus
			harum cupiditate ut delectus blanditiis maiores atque error nesciunt
			reiciendis asperiores necessitatibus obcaecati quasi sed ab, at
			ipsam rerum quibusdam.
		</p>
	</div>
</div>

<div class="flex flex-col gap-6 px-2 mt-8">
	<Panel direction="bg-gradient-to-br" class="flex gap-4 justify-center">
		<GitHub class="h-6 w-6" />
		<Instagram class="h-6 w-6" />
		<LinkedIn class="h-6 w-6" />
	</Panel>
</div>
