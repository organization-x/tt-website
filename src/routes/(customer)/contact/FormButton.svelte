<script lang="ts">
	export let hidden: boolean;
	export let disabled: boolean;
</script>

<button
	on:click
	{disabled}
	class:opacity-0={hidden}
	class="px-4 py-3 mt-8 bg-white text-black transition-colors rounded-lg w-24 disabled:bg-gray-500"
>
	<slot />
</button>
