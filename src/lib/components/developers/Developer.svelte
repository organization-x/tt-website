<script lang="ts">
	import type { Developer } from "../../types";
	import Button from "../Button.svelte";
	import GradientText from "../GradientText.svelte";
	import Bulb from "../icons/Bulb.svelte";
	import Desktop from "../icons/Desktop.svelte";
	import Python from "../icons/Python.svelte";
	import Wrench from "../icons/Wrench.svelte";
	import DevList from "./DevList.svelte";
	import DevPos from "./DevPos.svelte";

	export let info: Developer;
</script>

<div class="bg-gray-500/40 rounded-lg w-full h-full snap-center py-6 px-4">
	<div class="flex items-center gap-4">
		<img
			height="200"
			width="200"
			src={info.src}
			alt={info.alt}
			loading="lazy"
			class="rounded-full my-auto w-20"
		/>
		<div>
			<h1 class="font-bold">{info.role.toUpperCase()}</h1>
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
	<Button href={info.href} class="mt-8 mx-auto">View Profile</Button>
</div>
