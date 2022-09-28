<script lang="ts">
	import type { User } from "@prisma/client";

	export let user: User;
	export let current: boolean;
</script>

<button
	on:click
	class:grayscale={!current}
	class:cursor-pointer={!current}
	class="font-semibold flex jsutify-center gap-4 items-center h-14 bg-gray-500/40 rounded-lg px-4 snap-center shrink-0 select-none"
>
	<!-- TODO: Replace placeholder -->
	<img
		height="200"
		width="200"
		src="/assets/developers/user/placeholder/icon.webp"
		loading="lazy"
		alt="{user.name}'s avatar"
		class="rounded-full w-10"
	/>
	<h1>{user.name}</h1>
</button>
