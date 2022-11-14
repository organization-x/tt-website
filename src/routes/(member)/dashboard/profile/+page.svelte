<script lang="ts">
	import { user } from "$lib/stores";
	import UserEditor from "$lib/components/dashboard/UserEditor.svelte";
</script>

<UserEditor original={user} />
