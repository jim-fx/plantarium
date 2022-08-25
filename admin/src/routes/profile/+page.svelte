<script lang="ts">
  import ApiCall from '$lib/components/ApiCall.svelte';
  import { JSONView } from '@plantarium/ui';

  import { getUserInfo } from '@plantarium/client-api';
</script>

<ApiCall promise={getUserInfo()} let:data>
  <JSONView value={data} />
</ApiCall>
