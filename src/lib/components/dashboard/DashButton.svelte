<script lang="ts">
	let className: string;
	export let disabled = false;

	export { className as class };
</script>

<button
	on:click
	{disabled}
	class="px-4 py-3 rounded-lg w-24 transition-opacity disabled:opacity-60 {className}"
>
	<slot />
</button>
