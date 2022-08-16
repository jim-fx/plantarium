<script lang="ts">
  import { ReportCard, SortableTable } from '$lib/components';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<div class="container w-min mx-auto rounded overflow-hidden">
  <SortableTable
    items={data}
    component={ReportCard}
    componentKey="report"
    defaultKey="open"
  />
</div>
