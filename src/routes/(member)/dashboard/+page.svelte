<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<h1>Main Dashboard</h1>
<h1>{data.user.about}</h1>
