<script lang="ts">
	export let href: string;
</script>

<li class="p-4">
	<a {href} target="_blank" rel="noopener noreferrer">
		<slot />
	</a>
</li>
