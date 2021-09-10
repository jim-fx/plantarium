<script lang="ts">
	import { api } from '$lib';

	const reportPromise = api.get('api/report');
</script>

{#await reportPromise}
	Loading ...
{:then reports}
	<pre>
		<code>
	{JSON.stringify(reports, null, 2)}
	</code>
	</pre>
{/await}
