<script lang="ts">
	import GradientText from "$lib/components/GradientText.svelte";

	import type { User } from "@prisma/client";

	export let user: User;
	export let title: string;
</script>

<div
	class="flex flex-col gap-5 my-10 items-center lg:flex-row lg:justify-center lg:my-16"
>
	<!-- TODO: Replace placeholder -->
	<img
		width="200"
		height="200"
		src="/assets/developers/user/placeholder/icon.webp"
		alt="{user.name}'s avatar"
		class="w-20 h-20 rounded-full"
	/>

	<GradientText class="from-green-light to-green-dark text-3xl font-bold">
		{title}
	</GradientText>
</div>
