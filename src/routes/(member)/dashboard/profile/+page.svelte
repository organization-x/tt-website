<script lang="ts">
	import { user } from "$lib/stores";
	import UserEditor from "../UserEditor.svelte";
</script>

<UserEditor original={user} />
