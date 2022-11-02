<script lang="ts">
	export let name: string;
</script>

<div
	class="bg-gray-500/40 rounded-lg overflow-hidden flex gap-4 items-center px-4 py-6 justify-center lg:justify-start"
>
	<slot name="badge" />

	<div>
		<h1 class="font-semibold text-lg">{name}</h1>

		<p class="text-sm">
			<slot />
		</p>
	</div>
</div>
