<script lang="ts" context="module">
  import * as api from '@plantarium/client-api';

  import type { Project } from '@plantarium/backend';
  import type { PlantProject } from '@plantarium/types';

  export async function load({ params }) {
    const project = await api.getProject(params.projectId);

    if (project.ok) {
      const plant = JSON.parse(project.data.data as unknown as string);

      return {
        props: {
          project: project.data,
          plant,
        },
      };
    } else {
      throw new Error(project.message);
    }
  }
</script>

<script lang="ts">
  import { Detail } from '$lib/components';
  import { onMount } from 'svelte';
  import { permissions } from '@plantarium/client-api';
  import { createAlert } from '@plantarium/ui';
  const { VITE_API_URL } = import.meta.env;

  export let project: Project;
  export let plant: PlantProject;

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
  h3 {
    @apply text-md font-bold;
  }

  :global(.multiselect) {
    margin: 0px;
  }

  .stack > :global(.wrapper) {
    background: white;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  }

  .publish {
    @apply rounded-md p-2 py-1;
    color: var(--background-color, white);
    background-color: var(--text-color, black);
  }
</style>
