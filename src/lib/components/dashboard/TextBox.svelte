<script lang="ts">
	export let max: number;
	export let value: string;
	export let placeholder: string;
</script>

<div>
	{#if $$slots.label}
		<slot name="label" />
	{/if}
	<textarea
		on:input
		class:mt-3={$$slots.label}
		type="text"
		class="w-full h-72 bg-gray-500/40 resize-none p-4 rounded-lg select-none focus:outline-none"
		maxlength={max}
		{value}
		{placeholder}
	/>
</div>
