<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { api } from '$lib';

  const user = api.userStore;

  $: isLoggedIn = !!$user?.username;

  $: sites = [
    ['/', 'Home'],
    ['/reports', 'Reports'],
    ['/users', 'Users'],
    isLoggedIn ? ['/profile', 'Profile'] : [],
    isLoggedIn ? ['/logout', 'Logout'] : ['/login', 'Login'],
  ];
</script>

<div class="text-center my-6">
  <nav class="rounded shadow-xl w-auto inline-block p-2 mx-auto object-center">
    {#each sites as [href, title]}
      {#if href}
        <a
          class="p-3 rounded"
          class:underline={href === $page.url.pathname}
          href={base + href}
        >
          {title}
        </a>
      {/if}
    {/each}
  </nav>
</div>

<style>
  nav {
    background-color: var(--foreground-color);
  }
</style>
