<script lang="ts">
	import { debounce } from "$lib/debounce";

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

<button
	on:click
	use:debounce={props}
	{disabled}
	class:w-24={!icon}
	class:px-4={!icon}
	class:px-3={icon}
	class="rounded-lg relative py-3 text-center shrink-0 transition-[background-color,opacity] duration-200 disabled:opacity-60 disabled:pointer-events-none {className}"
>
	<slot />
</button>
