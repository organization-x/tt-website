<script lang="ts">
	export let placeholder: string;
	export let value: string | null = null;

	$: value = value || "";
</script>

<div>
	{#if $$slots.label}
		<slot name="label" />
	{/if}
	<div
		class:mt-2={$$slots.label}
		class="bg-gray-500/40 flex rounded-lg select-none"
	>
		{#if $$slots.icon}
			<div class="bg-gray-500/40 rounded-l-lg w-14 p-4">
				<slot name="icon" />
			</div>
		{/if}
		<input
			on:input
			maxlength="30"
			type="text"
			class="w-full h-full px-2 bg-transparent focus:outline-none p-4 my-auto"
			{placeholder}
			{value}
		/>
	</div>
</div>
