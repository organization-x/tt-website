<script lang="ts">
	export let href: string;
</script>

<li>
	<a {href} rel="noreferrer">
		<slot />
	</a>
</li>
