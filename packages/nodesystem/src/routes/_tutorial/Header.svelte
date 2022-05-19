<script lang="ts">
  import { Button } from '@plantarium/ui';
  import { ThemeProvider, currentTheme, setTheme } from '@plantarium/theme';
  import AlertWrapper from '@plantarium/ui/src/lib/alert/AlertWrapper.svelte';
  import ToastWrapper from '@plantarium/ui/src/lib/toast/ToastWrapper.svelte';
</script>

<header>
  <Button
    icon={$currentTheme === 'dark' ? 'bulb_dark' : 'bulb'}
    on:click={() => setTheme($currentTheme === 'dark' ? 'light' : 'dark')}
  />
  <slot />
</header>

<ThemeProvider />

<ToastWrapper />

<AlertWrapper />

<style>
  :global(body) {
    overflow: hidden;
  }
  header {
    position: absolute;
    z-index: 2;
    top: 10px;
    left: 10px;
    display: flex;
  }

  header > :global(.component-wrapper) {
    margin-right: 10px;
  }
</style>
