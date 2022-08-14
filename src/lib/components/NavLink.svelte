<script lang="ts">
	export let href: string;
	export let target: string | undefined = undefined;
</script>

<li class="p-4">
	<a {href} {target} rel="noreferrer noopener">
		<slot />
	</a>
</li>
