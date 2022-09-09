<script lang="ts">
	import type { User } from "@prisma/client";

	export let info: User;
	export let current: boolean;
</script>

<div
	on:click
	class:grayscale={!current}
	class:cursor-pointer={!current}
	class="font-semibold flex jsutify-center gap-4 items-center h-14 bg-gray-500/40 rounded-lg px-4 snap-center shrink-0 select-none"
>
	<img
		height="200"
		width="200"
		src={`/developers/user/${info.url}/icon.webp`}
		loading="lazy"
		alt={`${info.name} from Team Tomorrow`}
		class="rounded-full w-10"
	/>
	<h1>{info.name}</h1>
</div>
