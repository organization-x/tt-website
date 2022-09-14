<script lang="ts">
	import { page } from "$app/stores";
	import Text from "$lib/components/Text.svelte";
	import Button from "$lib/components/Button.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div
	class="flex h-screen text-center flex-col justify-center items-center px-4"
>
	<GradientText class="from-teal-light to-teal-dark text-8xl">
		{$page.status}
	</GradientText>

	<Text>
		Oops, something went wrong. Lost? Here's a handy link to the homepage!
	</Text>

	<Button href="/">Home</Button>
</div>
