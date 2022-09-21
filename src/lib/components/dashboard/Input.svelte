<script lang="ts">
	export let placeholder: string;
	export let value: string | null = null;
	export let title: string | null = null;

	$: value = value || "";
</script>

{#if title}
	<div>
		<h1 class="font-semibold text-xl">{title}</h1>
		<div class="bg-gray-500/40 flex rounded-lg select-none mt-2">
			<input
				bind:value
				type="text"
				class="w-full h-full px-2 bg-transparent focus:outline-none p-4 my-auto"
				{placeholder}
			/>
		</div>
	</div>
{:else}
	<div class="bg-gray-500/40 flex rounded-lg select-none">
		<div class="bg-gray-500/40 rounded-l-lg w-14 p-4">
			<slot />
		</div>
		<input
			bind:value
			type="text"
			class="w-full h-full px-2 py-4 bg-transparent focus:outline-none my-auto"
			{placeholder}
		/>
	</div>
{/if}
