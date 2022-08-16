<script lang="ts">
  import { goto } from '$app/navigation';

  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { logout, userStore } from '@plantarium/client-api';
  import { setTheme, currentTheme } from '@plantarium/theme';
  import { Button, createToast } from '@plantarium/ui';

  $: isLoggedIn = !!$userStore['username'];
  $: sites = [
    ['/', 'Home'],
    ['/reports', 'Reports'],
    ['/projects', 'Projects'],
    ['/users', 'Users'],
    isLoggedIn ? ['/profile', 'Profile'] : ['/login', 'Login'],
  ];
</script>

<nav class="rounded shadow-xl w-auto inline-block p-5 object-center h-screen">
  {#each sites as [href, title]}
    {#if href}
      <a
        class="p-3 rounded block"
        class:active={base + href === $page.url.pathname}
        href={base + href}
      >
        {title}
      </a>
    {/if}
  {/each}

  <br />
  {#if isLoggedIn}
    <Button
      name="logout"
      invert
      on:click={() => {
        logout();
        goto('/');
        createToast('Logged Out', { type: 'success' });
      }}
    />
  {/if}
  <br />

  <Button
    --foreground-color="transparent"
    on:click={() => setTheme($currentTheme === 'dark' ? 'light' : 'dark')}
    icon="bulb"
    active={$currentTheme === 'dark'}
  />
</nav>

<style>
  nav {
    background-color: var(--foreground-color);
  }
  .active {
    background-color: var(--midground-color);
  }
</style>
