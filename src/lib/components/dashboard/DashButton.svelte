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
	class:py-5={!icon}
	class:lg:px-5={!icon}
	class:py-4={icon}
	class:lg:px-3.5={icon}
	class:lg:py-3.5={icon}
	class="rounded-lg relative px-4 text-center shrink-0 leading-none transition-[background-color,opacity] duration-200 disabled:opacity-60 disabled:pointer-events-none {className}"
>
	<slot />
</button>
