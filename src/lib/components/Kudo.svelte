<script lang="ts">
	import { getContext } from "svelte";
	import { fly } from "svelte/transition";

	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import GradientText from "$lib/components/GradientText.svelte";

	let className = "";
	export let kudo: App.Kudo;
	export let lightBg = true;

	export { className as class };

	const timestamp = getContext("timestamp");
</script>

<div
	in:fly={{ duration: 300, y: 30 }}
	class:bg-gray-700={lightBg}
	class:bg-gray-900={!lightBg}
	class="rounded-lg flex min-h-[16rem] flex-col items-center justify-center gap-4 text-center p-4 md:flex-row md:text-start md:min-h-[9rem] {className}"
>
	<img
		width="512"
		height="512"
		src="{PUBLIC_CLOUDFLARE_URL}/avatar-{kudo.senderId}/avatar?{timestamp}"
		alt="{kudo.senderName}'s avatar"
		class="w-20 h-20 object-cover object-center bg-gray-400 rounded-full md:w-20 md:h-20 md:mt-1"
	/>

	<div
		class="flex flex-col gap-2 items-center w-full overflow-hidden md:gap-0 md:items-start"
	>
		<GradientText
			class="text-2xl font-semibold overflow-hidden shrink-0 from-green-light to-green-dark"
		>
			{kudo.senderName}
		</GradientText>

		<!-- Replace discord emojis with a unicode emojis -->
		<p class="break-words max-w-xs w-full md:max-w-sm lg:max-w-none">
			{kudo.reason.replaceAll(/<:[^<:>]+?:\d+?>/g, "👍")}
		</p>
	</div>
</div>
