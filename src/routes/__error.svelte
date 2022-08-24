<script lang="ts">
	import Text from "$lib/components/Text.svelte";
	import Button from "$lib/components/Button.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
</script>

<svelte:head>
	<title>404</title>
</svelte:head>

<div
	class="flex h-screen text-center flex-col justify-center items-center px-4"
>
	<GradientText class="from-teal-light to-teal-dark text-8xl">
		404
	</GradientText>

	<Text>
		The page you were looking for could not be found. Lost? Here's a handy
		link to the homepage!
	</Text>

	<Button href="/">Home</Button>
</div>
