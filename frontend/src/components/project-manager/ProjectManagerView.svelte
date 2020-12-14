<script lang="ts">
  import { InputSelect } from '@plantarium/ui';
  import { humane } from '@plantarium/helpers';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import type ProjectManager from './ProjectManager';
  export let pm: ProjectManager;

  export let visible = false;

  const { store } = pm;
</script>

<style lang="scss">
  @import '../../themes.scss';
  .wrapper {
    position: relative;
    margin-top: -8px;
    width: fit-content;
    background-color: $light-green;
    opacity: 0;
    pointer-events: none;
    resize: both;
    border-radius: 0px 5px 5px 5px;

    resize: both;
    overflow: auto;
    min-width: 300px;
    overflow-x: hidden;
    min-height: 100px;
    max-height: min-content;
    max-width: 500px;
  }

  .visible {
    opacity: 1;
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

    > * {
      height: 100%;
      border-radius: 5px;
      padding: 0px 10px;
      background-color: $dark-green;
      color: white;
      font-size: 1em;
      border: none;

      > p {
        padding: 0px;
        color: white;
      }
    }

    > :global(#main > *) {
      background-color: $dark-green;
      font-size: 1em;
    }

    > button {
      cursor: pointer;
    }
  }

  .close {
    width: 30px;
  }

  .project-list {
    overflow-y: hidden;
    overflow-x: hidden;
    padding: 3px;
    padding-right: 7px;
    padding-top: 7px;
  }

  .project-wrapper {
    position: relative;
    height: 100px;
    padding: 4px;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 100px 1fr;

    > .project-image {
      background-image: url('../assets/rocky_dirt1-albedo.jpg');
      border-radius: 10px;
      background-size: cover;
      width: 100px;
      height: 100%;
      display: inline-block;
    }

    > .project-content {
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding-left: 5px;

      > .project-content-header {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        justify-content: space-between;

        > p {
          font-size: 0.8em;
        }
      }

      > .project-content-footer {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;

        > button {
          font-size: 0.8em;
          border: none;
          border-radius: 6px;
          margin: 0;
          margin-right: 5px;

          &.delete {
            background-color: $light-red;
          }
        }
      }
    }

    &.active {
      background-color: lightblue;
    }
  }
</style>

<div class="wrapper" class:visible>
  <div class="header">
    <button class="add-new" on:click={() => pm.createNew()}>
      <p>new</p>
    </button>
    <input type="text" class="search" placeholder="Search" />
    <InputSelect values={['Date', 'Test', 'Test2']} />
    <button class="close" on:click={() => dispatch('close')}>
      <p>x</p>
    </button>
  </div>

  {#if visible}
    <div class="project-list">
      {#each $store as project}
        <div
          class="project-wrapper"
          class:active={project.meta.id === pm.activeProjectId}
          on:click={() => pm.setActiveProject(project.meta.id)}>
          <div class="project-image">
            <!--  -->
          </div>
          <div class="project-content">
            <div class="project-content-header">
              <h3
                contenteditable
                on:input={function (ev) {
                  pm.updateProjectMeta(project.meta.id, {
                    name: ev.currentTarget.innerText,
                  });
                }}>
                {project.meta.name}
              </h3>
              <p>{humane.time(Date.now() - project.meta.lastSaved)} ago</p>
            </div>
            <div class="project-content-main" />
            <div class="project-content-footer">
              <button class="delete">delete</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
