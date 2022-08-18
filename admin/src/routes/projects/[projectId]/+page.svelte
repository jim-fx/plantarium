<script lang="ts">
  import { Detail } from '$lib/components';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import api, { permissions } from '@plantarium/client-api';
  import { createAlert } from '@plantarium/ui';
  const { VITE_API_URL } = import.meta.env;

  export let data: PageData;

  $: ({ project } = data);

  async function handleDelete() {
    if (!project) return;

    const res = await createAlert(
      'Do you want to delete ' + project.meta.name + '?',
      { values: ['yes', 'no'] },
    );

    if (res === 'yes') {
      const resp = await api.deleteProject(project.id);
      console.log({ resp });
    }
  }

  onMount(async () => {
    await api.getPermission();
  });
</script>

{#if project}
  <header class="flex justify-between border-bottom items-center">
    <h2 class="text-4xl">
      <b>{project.meta.name}</b>
    </h2>

    <div>
      <a href={`${VITE_API_URL}/api/project/${project.id}`}>api</a>
    </div>
  </header>

  <hr class="my-2" />

  {#if project.meta.thumbnail}
    <img src={project.meta.thumbnail} alt="" />
  {/if}

  <br />

  {#if project.meta.description}
    <p>{project.meta.description}</p>
  {/if}

  <br />

  <hr class="my-2" />

  <footer class="flex items-center justify-between mb-10">
    <Detail object={project} />

    {#if $permissions.includes('project.delete')}
      <button
        class="bg-red-600 rounded-md text-white px-2 py-1 self-start"
        on:click={() => handleDelete()}>delete</button
      >
    {/if}
  </footer>
{:else}
  <p>Loading</p>
{/if}

<style>
  :global(.multiselect) {
    margin: 0px;
  }
</style>
