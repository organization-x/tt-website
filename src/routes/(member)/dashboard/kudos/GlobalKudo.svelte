<script lang="ts">
	import { getContext } from "svelte";
	import { fly } from "svelte/transition";

	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import GradientText from "$lib/components/GradientText.svelte";

	let className = "";
	export let kudo: App.Kudo;

	export { className as class };

	const timestamp = getContext("timestamp");
</script>

<div
	in:fly={{ duration: 300, y: 30 }}
	class="rounded-lg flex min-h-[30rem] bg-gray-900 flex-col items-center justify-center text-center p-4 py-10 sm:min-h-[23rem] sm:gap-3 sm:text-left lg:px-8 lg:min-h-52 lg:grid lg:kudo-cols lg:grid-rows-2 lg:gap-y-6 {className}"
>
	<div
		class="flex flex-col w-full items-center sm:flex-row sm:gap-3 sm:justify-center lg:justify-start lg:min-h-[6rem]"
	>
		<img
			width="512"
			height="512"
			src="{PUBLIC_CLOUDFLARE_URL}/avatar-{kudo.senderId}/avatar?{timestamp}"
			alt="{kudo.senderName}'s avatar"
			class="w-20 h-20 object-cover object-center bg-gray-400 rounded-full"
		/>

		<GradientText
			class="text-2xl font-semibold overflow-hidden from-green-light to-green-dark mb-6 mt-3 sm:my-0 sm:w-fit sm:max-w-xs lg:max-w-60"
		>
			{kudo.senderName}
		</GradientText>
	</div>

	<!-- Replace discord emojis with a unicode emojis -->
	<p
		class="break-words max-w-xs w-full my-auto sm:mx-auto sm:text-center lg:row-span-2"
	>
		{kudo.reason.replaceAll(/<:[^<:>]+?:\d+?>/g, "👍")}
	</p>

	<div
		class="flex flex-col w-full items-center sm:flex-row sm:gap-3 sm:justify-center lg:justify-start lg:min-h-[6rem]"
	>
		<img
			width="512"
			height="512"
			src="{PUBLIC_CLOUDFLARE_URL}/avatar-{kudo.receiverId}/avatar?{timestamp}"
			alt="{kudo.receiverName}'s avatar"
			class="w-20 h-20 object-cover object-center bg-gray-400 rounded-full mt-6 mb-3 sm:my-0"
		/>

		<GradientText
			class="text-2xl font-semibold overflow-hidden from-green-light to-green-dark sm:w-fit sm:max-w-xs lg:max-w-60 "
		>
			{kudo.receiverName}
		</GradientText>
	</div>
</div>
