<script lang="ts">
	export let pos: string;
	export let name: string;
</script>

<div class="shrink-0 w-32">
	<slot />
	<h4 class="font-semibold">{name}</h4>
	<h5 class="text-sm">{pos}</h5>
</div>
