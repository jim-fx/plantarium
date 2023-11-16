<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import api, { permissions } from '@plantarium/client-api';
  import { createAlert, Icon, JSONView } from '@plantarium/ui';
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

  let updatingProjectType = false;
  async function updateProjectType(type = project.type) {
    if (updatingProjectType) return;
    updatingProjectType = true;

    try {
      const res = await api.updateProject(project.id, { type });
    } catch (error) {}
    updatingProjectType = false;
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

    <div class="flex gap-2 items-center">
      {#if updatingProjectType}
        <Icon --width="16px" name="loading" animated />
      {/if}
      <select
        disabled={updatingProjectType}
        bind:value={project.type}
        on:input={(ev) => updateProjectType(ev.target.value)}
      >
        <option value="2">official</option>
        <option value="1">approved</option>
        <option value="0">user-submitted</option>
      </select>
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
    <JSONView value={project} />

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
  select {
    background: var(--background-color);
  }
  :global(.multiselect) {
    margin: 0px;
  }
</style>
