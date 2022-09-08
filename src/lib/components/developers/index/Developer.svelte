<script lang="ts">
	import type { User } from "@prisma/client";

	import DevPos from "./DevPos.svelte";
	import DevList from "./DevList.svelte";
	import Button from "../../Button.svelte";
	import Bulb from "../../icons/Bulb.svelte";
	import Wrench from "../../icons/Wrench.svelte";
	import Python from "../../icons/Python.svelte";
	import Desktop from "../../icons/Desktop.svelte";
	import GradientText from "../../GradientText.svelte";

	export let info: User;
</script>

<div
	class="bg-gray-500/40 rounded-lg w-full h-full snap-center py-6 px-4 max-w-xl mx-auto shrink-0"
>
	<div class="flex items-center gap-4">
		<img
			height="200"
			width="200"
			src={`/developers/user/${info.url}/icon.webp`}
			alt={`${info.name} from Team Tomorrow`}
			loading="lazy"
			class="rounded-full my-auto w-20"
		/>
		<div>
			<h1 class="font-bold">
				{info.team ? info.team.toUpperCase() : "UNKNOWN"}
			</h1>
			<GradientText class="from-green-light to-green-dark text-3xl">
				{info.name}
			</GradientText>
		</div>
	</div>
	<p class="mt-4">
		<slot />
	</p>
	<DevList title="Positions" icon={Bulb}>
		<DevPos name="Frontend Developer" icon={Desktop} />
		<DevPos name="Frontend Developer" icon={Desktop} />
	</DevList>
	<DevList title="Skills" icon={Wrench}>
		<DevPos name="Python" icon={Python} />
		<DevPos name="Python" icon={Python} />
	</DevList>
	<Button href={`/developers/${info.url}`} class="mt-8 mx-auto"
		>View Profile</Button
	>
</div>
