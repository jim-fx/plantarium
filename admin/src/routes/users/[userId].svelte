<script lang="ts" context="module">
  import { api } from '$lib';

  import type { User } from '@plantarium/backend';

  export async function load({ params }) {
    const user = await api.get('api/user/' + params.userId);
    return {
      props: {
        user,
        userId: params.userId,
      },
    };
  }
</script>

<script lang="ts">
  import { page } from '$app/stores';
  const { reportId } = $page.params;
  import { userStore } from '@plantarium/client-api';

  const { VITE_API_URL = 'http://localhost:3000' } = import.meta.env;

  export let user: User;
  export let userId: string;

  console.log({ user, userId });
</script>

{#if !user}
  Loading ... {reportId}
{:else}
  <header class="flex justify-between border-bottom items-center">
    <h2 class="text-4xl">
      <b>{user.username}</b>
    </h2>

    <div>
      <a href={`${VITE_API_URL}/api/user/${userId}`}>api</a>
    </div>
  </header>
  <br />

  <hr class="my-2" />

  {#if user.profilePic}
    <img src={user.profilePic} alt="" />
  {/if}

  <br />
  <h1 class="text-4xl">{user.role ? user.role : ''}</h1>

  <br />

  <hr class="my-2" />

  <footer class="flex items-center justify-between mb-10">
    {#if $userStore?.permissions?.includes('user.delete')}
      <button class="bg-red-600 rounded-md text-white px-2 py-1 self-start"
        >delete</button
      >
    {/if}
  </footer>
{/if}
