<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
	import PageGradient from "$lib/components/PageGradient.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
</script>

<div class="mx-4">
	<PageGradient />

	<PageTitle class="from-green-light to-green-dark">
		About Team Tomorrow and AI Camp.
	</PageTitle>

	<PageCaption>
		Explore what acheivements we've <strong>accomplished</strong> and how we
		did it.
	</PageCaption>

	<img
		class="mt-6"
		src="/about.webp"
		alt="Brain shape made up of connected nodes"
	/>

	<TextHeader>Where it all began.</TextHeader>
</div>
