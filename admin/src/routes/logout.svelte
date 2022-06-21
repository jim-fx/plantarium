<script lang="ts">
  import { goto } from '$app/navigation';

  import { logout } from '@plantarium/client-api';
  import { createToast } from '@plantarium/ui';
</script>

<button
  on:click={() => {
    logout();
    goto('/');
    createToast('Logged Out', { type: 'success' });
  }}>logout</button
>
