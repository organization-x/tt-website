<script lang="ts">
	export let title: string;
	let className: string | null = null;

	export { className as class };
</script>

<div class={className}>
	<div class="flex font-semibold justify-center items-center gap-3">
		<slot name="icon" />
		<h1 class="text-lg">{title}</h1>
	</div>
	<div class="flex flex-col gap-4 mt-4 md:grid md:grid-cols-2">
		<slot />
	</div>
</div>
