<script lang="ts">
  import { InputSelect } from '@plantarium/ui';
  import ResizeObserer from 'svelte-resize-observer';
  import { localState } from '../../helpers';
  import Project from './Project.svelte';
  import type ProjectManager from './ProjectManager';
  export let pm: ProjectManager;

  export let visible = false;

  const { store } = pm;

  const { width, height } = localState.get('pmSize', {
    width: 'unset',
    height: 'unset',
  });
</script>

<div
  class="wrapper"
  class:visible
  style={`width: ${width}px; height: ${height}px;`}
>
  <ResizeObserer
    on:resize={(ev) =>
      localState.set('pmSize', {
        width: ev.detail.contentRect.width,
        height: ev.detail.contentRect.height,
      })}
  />
  <div class="header">
    <button class="add-new" on:click={() => pm.createNew()}>
      <p>new</p>
    </button>
    {#if $store.length > 3}
      <input type="text" class="search" placeholder="Search" />
    {:else}
      <div />
    {/if}
    <InputSelect values={['Date', 'Test', 'Test2']} />
  </div>

  {#if visible}
    <div class="project-list">
      {#each $store as project}
        <Project {project} {pm} />
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @import '../../themes.scss';
  .wrapper {
    position: absolute;
    margin-top: -8px;
    width: fit-content;
    background-color: $light-green;
    display: none;

    pointer-events: none;
    resize: both;
    border-radius: 0px 5px 5px 5px;

    margin-bottom: 8px;

    resize: both;
    overflow: auto;
    min-width: 300px;
    overflow-x: hidden;
    min-height: 100px;
    max-height: 70vh;
    max-width: 500px;
  }

  .visible {
    display: block;
    pointer-events: all;
  }

  .header {
    position: sticky;
    top: 0px;
    left: 0px;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    column-gap: 5px;
    padding: 7px;
    z-index: 99;
    min-height: 30px;
    padding-bottom: 0px;
    top: 0px;
    left: 0px;
    background: linear-gradient(0deg, #65e29f00 0%, #65e29f 50%);

    > button,
    input {
      height: 100%;
      border-radius: 5px;
      padding: 0px 10px;
      background-color: $dark-green;
      color: white;
      font-size: 1em;
      border: none;
    }

    > :global(#main > *) {
      background-color: $dark-green;
      font-size: 1em;
    }

    > button {
      cursor: pointer;
    }
  }

  .project-list {
    overflow-y: hidden;
    overflow-x: hidden;
    padding: 3px;
    padding-right: 7px;
    padding-top: 7px;
  }
</style>
