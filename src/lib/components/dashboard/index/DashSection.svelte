<script lang="ts">
	let className = "";
	export let title: string;

	export { className as class };
</script>

<div>
	<h1 class="font-semibold text-2xl text-center mb-5">{title}</h1>
	<div class="rounded-lg {className}">
		<slot />
	</div>
</div>
