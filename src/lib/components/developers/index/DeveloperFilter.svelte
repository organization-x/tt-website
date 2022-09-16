<script lang="ts">
	import type { User } from "@prisma/client";

	export let user: User;
	export let current: boolean;

	const { url, name } = user;
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
		src="/developers/user/{url}/icon.webp"
		loading="lazy"
		alt="{name}'s avatar"
		class="rounded-full w-10"
	/>
	<h1>{name}</h1>
</div>
