<script lang="ts">
	export let max: number;
	export let value: string;
	export let lightBg = true;
	export let placeholder: string;
	export let title: string | null = null;
</script>

<div>
	{#if title}
		<h1 class="font-semibold text-xl">{title}</h1>
	{/if}

	<textarea
		bind:value
		class:mt-3={title}
		type="text"
		class:bg-gray-700={lightBg}
		class:bg-gray-900={!lightBg}
		class="w-full h-72 resize-none p-4 rounded-lg select-none focus:outline-none"
		maxlength={max}
		{placeholder}
	/>
</div>
