<script lang="ts">
	import { api } from '$lib';
	import { ReportCard, SortableTable } from '$lib/components';
</script>

<div class="container w-min mx-auto rounded overflow-hidden">
	{#await api.get('api/report')}
		Loading ...
	{:then reports}
		<SortableTable items={reports} component={ReportCard} componentKey="report"/>
	{/await}
</div>
