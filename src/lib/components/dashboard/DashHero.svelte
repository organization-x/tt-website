<script lang="ts">
	import GradientText from "$lib/components/GradientText.svelte";

	export let title: string;
</script>

<div
	class="flex flex-col gap-5 my-10 items-center lg:flex-row lg:justify-center lg:my-16"
>
	<GradientText
		class="from-green-light to-green-dark text-3xl font-bold text-center"
	>
		{title}
	</GradientText>
</div>
