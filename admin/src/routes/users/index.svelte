<script lang="ts">
  import { api } from '$lib';
  import { ReportCard, SortableTable } from '$lib/components';
</script>

<div class="container w-min mx-auto rounded overflow-hidden">
  {#await api.get('api/user')}
    Loading ...
  {:then users}
    {#each users as u}
      <a href="/users/{u._id}">{u.username}</a>
      <br />
    {/each}
  {/await}
</div>
