<script>
  import 'virtual:windi.css';
  import { browser } from '$app/environment';
  import NavBar from '$lib/NavBar.svelte';
  if (browser) import('virtual:windi-devtools');
  import { AlertWrapper } from '@plantarium/ui';
  import { ThemeProvider } from '@plantarium/theme';
  import { onMount } from 'svelte';
  import api from '@plantarium/client-api';

  onMount(async () => {
    window['api'] = api;
  });
</script>

<AlertWrapper />

<ThemeProvider />

<div class="fixed h-screen w-screen">
  <NavBar />
  <main class="overflow-scroll p-5 w-full">
    <slot />
  </main>
</div>

<style>
  div {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: 3px;
  }
  :global(a)::before {
    content: 🔗;
  }
  :global(body) {
    color: var(--text-color);
    background-color: var(--background-color);
  }
</style>
