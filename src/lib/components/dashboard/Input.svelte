<script lang="ts">
	export let title = "";
	export let lightBg = true;
	export let placeholder = "";
	export let value: string | null;
	export let max: number | null = null;

	let input = value || "";

	$: {
		const trim = input?.trim();

		if (trim && trim.length) value = trim;
		else value = null;
	}
</script>

{#if title.length}
	<div>
		<h1 class="font-semibold text-xl">{title}</h1>
		<div
			class:bg-gray-700={lightBg}
			class:bg-gray-900={!lightBg}
			class="flex rounded-lg select-none mt-2"
		>
			<input
				bind:value={input}
				type="text"
				class="w-full h-full px-2 bg-transparent focus:outline-none p-4 my-auto"
				{placeholder}
				maxlength={max}
			/>
		</div>
	</div>
{:else}
	<div
		class:bg-gray-700={lightBg}
		class:bg-gray-900={!lightBg}
		class="flex rounded-lg select-none"
	>
		<div
			class:bg-gray-500={lightBg}
			class:bg-gray-700={!lightBg}
			class="rounded-l-lg w-14 p-4"
		>
			<slot />
		</div>
		<input
			bind:value={input}
			type="text"
			class="w-full h-full px-2 py-4 bg-transparent focus:outline-none my-auto"
			{placeholder}
			maxlength={max}
		/>
	</div>
{/if}
