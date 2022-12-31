<script lang="ts">
	import { getContext } from "svelte";

	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";

	import type { Writable } from "svelte/store";

	export let theme = "";
	export let author: App.Author;

	const timestamp = getContext("timestamp") as string;
	const tabindex = getContext<Writable<number>>("tabindex");
</script>

<a
	href="/developers/{author.user.url}"
	class="flex gap-3 pb-4 items-center shrink-0 relative snap-center

    after:duration-200 after:transition-transform after:inset-x-2 after:h-0.5 after:absolute after:bottom-1 after:rounded-full after:bg-white after:scale-x-0 hover:after:scale-x-100"
	rel="noopener noreferrer"
	tabindex={$tabindex}
>
	<img
		class:border-4={theme.length}
		class="rounded-full bg-gray-400 w-12 h-12 object-cover object-center"
		style={theme.length ? `border-color: #${theme}` : ""}
		height="512"
		width="512"
		src="{PUBLIC_CLOUDFLARE_URL}/avatar-{author.user.id}/avatar?{timestamp}"
		alt="{author.user.name}'s avatar"
		loading="lazy"
	/>

	<div class="overflow-hidden">
		<h1
			class="font-semibold text-xl overflow-auto scrollbar-hidden max-w-44 lg:max-w-60"
		>
			{author.user.name.split(/\s+/)[0]}
		</h1>

		<p class="text-xs -mt-1">{author.position.replaceAll("_", " ")}</p>
	</div>
</a>
