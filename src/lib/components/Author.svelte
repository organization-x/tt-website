<script lang="ts">
	import { getContext } from "svelte";

	export let theme = "";
	export let author: App.Author;

	const timestamp = getContext("timestamp") as string;
</script>

<a
	href="/developers/{author.user.url}"
	class="flex gap-2 pt-2 pb-3 items-center shrink-0 relative rounded-lg snap-center lg:mx-0

    after:duration-200 after:transition-transform after:inset-x-2 after:h-0.5 after:absolute after:-bottom-1 after:rounded-full after:bg-white after:scale-x-0 hover:after:scale-x-100"
	rel="noopener noreferrer"
>
	<img
		class:border-4={theme.length}
		class="rounded-full bg-gray-400 my-auto w-12 object-cover object-center"
		style={theme.length ? `border-color: #${theme}` : ""}
		height="512"
		width="512"
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{author
			.user.id}/avatar?{timestamp}"
		alt="{author.user.name}'s avatar"
		loading="lazy"
	/>

	<div class="overflow-hidden">
		<h1
			class="font-semibold text-xl overflow-auto scrollbar-hidden max-w-44 lg:max-w-60"
		>
			{author.user.name.split(" ")[0]}
		</h1>

		<p class="text-xs -mt-1">{author.position.replaceAll("_", " ")}</p>
	</div>
</a>
