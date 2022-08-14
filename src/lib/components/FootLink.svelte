<script lang="ts">
	export let href: string;
</script>

<li>
	<a {href} rel="noreferrer noopener">
		<slot />
	</a>
</li>
