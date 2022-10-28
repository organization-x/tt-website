<script lang="ts">
	import { getContext } from "svelte";

	import type { User } from "@prisma/client";

	const timestamp = getContext("timestamp") as string;

	export let user: User;
	export let current: boolean;
</script>

<button
	on:click
	class:grayscale={!current}
	class:cursor-pointer={!current}
	class="font-semibold flex jsutify-center gap-4 justify-center items-center h-14 bg-gray-500/40 rounded-lg px-4 snap-center shrink-0 select-none w-56"
>
	<img
		height="512"
		width="512"
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{user.id}/avatar?{timestamp}"
		loading="lazy"
		alt="{user.name}'s avatar"
		class="rounded-full w-10 bg-gray-400"
	/>

	<h1>{user.name.split(" ")[0]}</h1>
</button>
