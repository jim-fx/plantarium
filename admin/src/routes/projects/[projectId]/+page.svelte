<script lang="ts">
  import { Detail } from '$lib/components';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import api, { permissions } from '@plantarium/client-api';
  import { createAlert } from '@plantarium/ui';
  const { VITE_API_URL } = import.meta.env;

  export let data: PageData;

  $: ({ project, plant } = data);

  async function handleDelete() {
    const res = await createAlert(
      'Do you want to delete ' + plant.meta.name + '?',
      { values: ['yes', 'no'] },
    );

    if (res === 'yes') {
      const resp = await api.deleteProject(project._id);
      console.log({ resp });
    }
  }

  onMount(async () => {
    const res = await api.getPermission();
    console.log({ res });
  });
</script>

<header class="flex justify-between border-bottom items-center">
  <h2 class="text-4xl">
    <b>{plant.meta.name}</b>
  </h2>

  <div>
    <a href={`${VITE_API_URL}/api/project/${project._id}`}>api</a>
  </div>
</header>

<hr class="my-2" />

{#if plant.meta.thumbnail}
  <img src={plant.meta.thumbnail} alt="" />
{/if}

<br />

{#if plant.meta.description}
  <p>{plant.meta.description}</p>
{/if}

<br />

<hr class="my-2" />

<footer class="flex items-center justify-between mb-10">
  <Detail object={project} />
  <Detail object={plant} />

  {#if $permissions.includes('project.delete')}
    <button
      class="bg-red-600 rounded-md text-white px-2 py-1 self-start"
      on:click={() => handleDelete()}>delete</button
    >
  {/if}
</footer>

<style>
  :global(.multiselect) {
    margin: 0px;
  }
</style>
