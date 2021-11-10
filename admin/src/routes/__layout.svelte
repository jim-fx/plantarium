<script>
  import 'virtual:windi.css';
  import { browser } from '$app/env';
  import NavBar from '$lib/NavBar.svelte';
  if (browser) import('virtual:windi-devtools');
  import { AlertWrapper } from '@plantarium/ui';
  import { onMount } from 'svelte';
  import api from '@plantarium/client-api';

  onMount(async () => {
    window['api'] = api;
  });
</script>

<svelte:body class="bg-gray-50" />

<AlertWrapper />

<div class="container mx-auto">
  <NavBar />
  <slot />
</div>

<style>
  :global(a)::before {
    content: 🔗;
  }
</style>
