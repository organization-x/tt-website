<script lang="ts">
	export let theme = "";
	export let author: App.Author | App.Developer;
</script>

<a
	href="/developers/{author.user.url}"
	class="flex gap-2 py-2 items-center shrink-0 relative rounded-lg snap-center
    
    after:duration-200 after:transition-transform after:h-0.5 after:absolute after:right-4 after:-bottom-0.5 after:left-4 after:bg-white after:scale-x-0 hover:after:scale-x-100"
>
	<!-- TODO: Replace placeholder -->

	<img
		height="200"
		width="200"
		src="/assets/developers/user/placeholder/icon.webp"
		alt="{author.user.name}'s avatar"
		loading="lazy"
		class:border-4={theme.length}
		class="rounded-full my-auto w-12"
		style={theme.length ? `border-color: #${theme}` : ""}
	/>
	<div>
		<h1 class="leading-4 font-semibold text-xl">
			{author.user.name.split(" ")[0]}
		</h1>
		<p class="text-xs mt-1">{author.position}</p>
	</div>
</a>
