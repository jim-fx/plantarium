<script lang="ts">
  import { ReportCard, SortableTable } from '$lib/components';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  $: console.log('Arr', data);
</script>

<div class="container w-min mx-auto rounded overflow-hidden">
  <SortableTable
    items={data.reports}
    component={ReportCard}
    componentKey="report"
    defaultKey="open"
  />
</div>
