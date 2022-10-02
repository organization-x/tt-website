<script lang="ts">
	import { debounce } from "$lib/debounce";

	export let href = "";
	let className: string;
	export let icon = false;
	export let disabled = false;
	let props:
		| {
				func: () => void;
				delay: number;
				bind: any;
		  }
		| undefined = undefined;

	export { className as class, props as debounce };
</script>

{#if href.length}
	<a
		{href}
		class:p-4={!icon}
		class:p-3={icon}
		rel="noreferrer noopener"
		class="block text-center rounded-lg shrink-0 {className}"
	>
		<slot />
	</a>
{:else}
	<button
		on:click
		use:debounce={props}
		{disabled}
		class:w-24={!icon}
		class:p-4={!icon}
		class:p-3={icon}
		class="rounded-lg text-center shrink-0 transition-opacity disabled:opacity-60 {className}"
	>
		<slot />
	</button>
{/if}
