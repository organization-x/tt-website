<script lang="ts">
	import { getContext } from "svelte";

	import GradientText from "$lib/components/GradientText.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	// Create a timestamp so the images from Cloudflare don't cache
	const timestamp = getContext("timestamp") as string;

	let search = "";
</script>

<div class="relative pt-18 px-5 lg:px-10">
	<img
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/banner-{data
			.userPage.id}/banner?{timestamp}"
		width="1920"
		height="1080"
		alt="{data.userPage.name}'s banner"
		class="-z-10 absolute bg-gray-400 top-0 inset-0 object-cover object-center w-full h-32 lg:h-44"
	/>

	<div class="flex flex-col items-center gap-4">
		<img
			width="512"
			height="512"
			src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{data
				.userPage.id}/avatar?{timestamp}"
			alt="{data.userPage.name}'s avatar"
			class="border-4 mt-4 border-black bg-gray-400 box-content object-cover object-center w-28 h-28 rounded-full lg:w-32 lg:mx-0 lg:h-32 lg:mb-2"
		/>

		<GradientText
			class="from-green-light to-green-dark text-center font-bold text-3xl w-full lg:text-start"
		>
			Projects
		</GradientText>
	</div>
</div>
