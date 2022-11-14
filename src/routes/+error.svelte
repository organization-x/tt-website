<script lang="ts">
	import "../app.css";

	import { page } from "$app/stores";
	import Button from "$lib/components/Button.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
</script>

<svelte:head>
	<title>Error {$page.status}</title>
</svelte:head>

<div
	class="flex h-screen text-center flex-col justify-center items-center px-4 xl:-mt-3"
>
	<GradientText class="from-teal-light to-teal-dark text-8xl">
		{$page.status}
	</GradientText>

	<p class="my-6 max-w-xs xl:mt-0">
		Oops, something went wrong. Lost? Here's a handy link to the homepage!
	</p>

	<Button href="/">Home</Button>
</div>
