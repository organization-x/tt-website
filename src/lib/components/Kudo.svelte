<script lang="ts">
	import { getContext } from "svelte";
	import GradientText from "$lib/components/GradientText.svelte";

	let className = "";
	export let kudo: App.Kudo;
	export let lightBg = true;

	export { className as class };

	const timestamp = getContext("timestamp");
</script>

<div
	class:bg-gray-700={lightBg}
	class:bg-gray-900={!lightBg}
	class:border-green-light={kudo.type === "received"}
	class:border-blue-light={kudo.type === "sent"}
	class="rounded-lg flex flex-col relative items-center gap-4 text-center p-4 pt-8 border-4 md:flex-row md:items-start md:text-start md:pt-6 {className}"
>
	<h1
		class:bg-green-light={kudo.type === "received"}
		class:bg-blue-light={kudo.type === "sent"}
		class="font-black rounded-sm py-0.5 px-2 text-sm absolute -top-3.5 select-none"
	>
		{kudo.type.toUpperCase()}
	</h1>

	<img
		width="512"
		height="512"
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{kudo.id}/avatar?{timestamp}"
		alt="{kudo.name}'s avatar"
		class="w-24 h-24 bg-gray-400 rounded-full md:w-20 md:h-20"
	/>

	<div
		class="flex flex-col gap-2 md:gap-0 items-center md:items-start w-full overflow-hidden md:mt-2"
	>
		<GradientText
			class="text-2xl font-semibold overflow-hidden shrink-0 {kudo.type ===
			'received'
				? 'from-green-light to-green-dark'
				: 'from-blue-light to-blue-dark'}"
		>
			{kudo.name}
		</GradientText>

		<p class="break-words max-w-xs w-full md:max-w-sm lg:max-w-none">
			{kudo.reason}
		</p>
	</div>
</div>
