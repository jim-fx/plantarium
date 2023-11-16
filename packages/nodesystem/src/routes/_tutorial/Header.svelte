<script lang="ts">
  import { Button, AlertWrapper, ToastWrapper } from '@plantarium/ui';
  import { ThemeProvider, ThemeStore, setTheme } from '@plantarium/theme';
</script>

<header>
  <Button
    icon="bulb"
    active={$ThemeStore === 'dark'}
    on:click={() => setTheme($ThemeStore === 'dark' ? 'light' : 'dark')}
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
    gap: 10px;
  }

  header > :global(.component-wrapper) {
    margin-right: 10px;
  }
</style>
