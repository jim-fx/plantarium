<script lang="ts">
  import { ReportCard, SortableTable } from '$lib/components';
  import ApiCall from '$lib/components/ApiCall.svelte';
</script>

<div class="container w-min mx-auto rounded overflow-hidden">
  <ApiCall path="api/report" let:data>
    <SortableTable items={data} component={ReportCard} componentKey="report" />
  </ApiCall>
</div>
