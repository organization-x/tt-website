<script lang="ts">
	import { user } from "$lib/stores";
	import GradientText from "$lib/components/GradientText.svelte";

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
		alt="{$user.name}'s avatar"
		class="w-20 h-20 rounded-full"
	/>

	<GradientText
		class="from-green-light to-green-dark text-3xl font-bold text-center"
	>
		{title}
	</GradientText>
</div>
