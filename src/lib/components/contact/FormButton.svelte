<script lang="ts">
	export let disabled: boolean;
	export let hidden: boolean;
</script>

<button
	on:click
	{disabled}
	class:opacity-0={hidden}
	class="px-4 py-3 mt-8 select-none bg-white text-black transition-colors rounded-lg w-24 disabled:bg-gray-500"
>
	<slot />
</button>
