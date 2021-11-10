<script>
  import 'virtual:windi.css';
  import { browser } from '$app/env';
  import NavBar from '$lib/NavBar.svelte';
  import { user } from '$lib';
  if (browser) import('virtual:windi-devtools');
  if (browser) document.body.classList.add('bg-gray-100');
  import { AlertWrapper } from '@plantarium/ui';
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
