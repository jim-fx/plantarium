<script lang="ts">
  import ApiCall from '$lib/components/ApiCall.svelte';

  import { getUserInfo } from '@plantarium/client-api';
</script>

<ApiCall promise={getUserInfo()} let:data>
  <pre><code>
  {JSON.stringify(data, null, 2)}
  </code></pre>
</ApiCall>
