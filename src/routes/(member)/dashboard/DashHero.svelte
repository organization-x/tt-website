<script lang="ts">
	import GradientText from "$lib/components/GradientText.svelte";

	export let title: string;
</script>

<GradientText
	class="from-green-light to-green-dark text-3xl font-bold text-center my-10 lg:my-16"
>
	{title}
</GradientText>
