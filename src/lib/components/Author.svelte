<script lang="ts">
	import { getContext } from "svelte";

	export let theme = "";
	export let author: App.Author;

	const timestamp = getContext("timestamp") as string;
</script>

<a
	href="/developers/{author.user.url}"
	class="flex gap-2 py-2 items-center shrink-0 relative rounded-lg snap-center

    after:duration-200 after:transition-transform after:h-0.5 after:absolute after:right-4 after:-bottom-0.5 after:left-4 after:bg-white after:scale-x-0 hover:after:scale-x-100"
	rel="noopener noreferrer"
>
	<img
		class:border-4={theme.length}
		class="rounded-full bg-gray-400 my-auto w-12"
		style={theme.length ? `border-color: #${theme}` : ""}
		height="512"
		width="512"
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{author
			.user.id}/avatar?{timestamp}"
		alt="{author.user.name}'s avatar"
		loading="lazy"
	/>
	<div>
		<h1 class="leading-4 font-semibold text-xl">
			{author.user.name.split(" ")[0]}
		</h1>
		<p class="text-xs mt-1">{author.position}</p>
	</div>
</a>
