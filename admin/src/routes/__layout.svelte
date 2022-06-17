<script>
  import 'virtual:windi.css';
  import { browser } from '$app/env';
  import NavBar from '$lib/NavBar.svelte';
  if (browser) import('virtual:windi-devtools');
  import { AlertWrapper, Button } from '@plantarium/ui';
  import { ThemeProvider, currentTheme, setTheme } from '@plantarium/theme';
  import { onMount } from 'svelte';
  import api from '@plantarium/client-api';

  onMount(async () => {
    window['api'] = api;
  });
</script>

<Button
  --foreground-color="transparent"
  on:click={() => setTheme($currentTheme === 'dark' ? 'light' : 'dark')}
  icon="bulb"
  active={$currentTheme === 'dark'}
/>

<AlertWrapper />

<ThemeProvider />

<div class="container mx-auto">
  <NavBar />
  <slot />
</div>

<style>
  :global(a)::before {
    content: 🔗;
  }
  :global(body) {
    color: var(--text-color);
    background-color: var(--background-color);
  }
</style>
