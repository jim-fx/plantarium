<script lang="ts">
  import { SortableTable } from '$lib/components';
  import ApiCall from '$lib/components/ApiCall.svelte';
</script>

<div class="container w-min mx-auto rounded overflow-hidden">
  <ApiCall path="api/project" let:data>
    <SortableTable items={data} componentKey="project" useLink />
  </ApiCall>
</div>
