<script lang="ts">
  import ApiCall from '$lib/components/ApiCall.svelte';
  import SortableTable from '$lib/components/SortableTable.svelte';
</script>

<div class="container w-min mx-auto rounded overflow-hidden">
  <ApiCall path="api/user" let:data>
    <SortableTable items={data} />
  </ApiCall>
</div>
