<script lang="ts">
	export let max: number;
	export let value: string;
	export let placeholder: string;
	export let title: string | null = null;
</script>

<div>
	{#if title}
		<h1 class="font-semibold text-xl">{title}</h1>
	{/if}
	<textarea
		on:input
		class:mt-3={title}
		type="text"
		class="w-full h-72 bg-gray-500/40 resize-none p-4 rounded-lg select-none focus:outline-none"
		maxlength={max}
		{value}
		{placeholder}
	/>
</div>
