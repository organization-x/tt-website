<script lang="ts">
	export let title: string | null = null;
</script>

{#if title}
	<div class="lg:w-full">
		<h1 class="font-semibold text-xl">{title}</h1>
		<div
			class="flex flex-col gap-4 bg-gray-500/40 p-4 mt-3 rounded-lg lg:grid lg:grid-cols-2"
		>
			<slot />
		</div>
	</div>
{:else}
	<div
		class="flex flex-col gap-4 bg-gray-500/40 p-4 mt-3 rounded-lg lg:w-full lg:grid lg:grid-cols-3"
	>
		<slot />
	</div>
{/if}
