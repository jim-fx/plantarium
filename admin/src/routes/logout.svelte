<script lang="ts">
	import { api } from '$lib';
</script>

<button on:click={() => api.logout()}>logout</button>
