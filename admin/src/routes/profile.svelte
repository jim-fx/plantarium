<script lang="ts">
  import { api } from '$lib';

  const profile = api.get('api/user/profile');
</script>

{#await profile}
  Loading
{:then prof}
  <pre><code>
  {JSON.stringify(prof, null, 2)}
  </code></pre>
{/await}
