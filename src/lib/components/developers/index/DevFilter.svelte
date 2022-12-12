<script lang="ts">
	import { getContext } from "svelte";

	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";

	import type { User } from "@prisma/client";

	const timestamp = getContext("timestamp") as string;

	export let user: User;
	export let current: boolean;
</script>

<button
	on:click
	class:grayscale={!current}
	class:cursor-auto={current}
	class:bg-gray-700={current}
	class:bg-gray-800={!current}
	class="font-semibold flex jsutify-center gap-4 justify-center items-center h-14 transition-colors rounded-lg px-4 snap-center shrink-0 select-none w-56"
>
	<img
		height="512"
		width="512"
		src="{PUBLIC_CLOUDFLARE_URL}/avatar-{user.id}/avatar?{timestamp}"
		loading="lazy"
		alt="{user.name}'s avatar"
		class="rounded-full w-10 h-10 object-cover object-center bg-gray-400"
	/>

	<h1 class="overflow-auto scrollbar-hidden">{user.name.split(" ")[0]}</h1>
</button>
