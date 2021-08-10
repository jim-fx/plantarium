<script lang="ts">
  import Nodes from '@plantarium/nodes';
  import { NodeSystem } from '@plantarium/nodesystem';
  import { Alert, Button } from '@plantarium/ui';
  import { onMount } from 'svelte';
  import ClickOutside from 'svelte-click-outside';
  import type { Writable } from 'svelte/store';
  import { ProjectManager } from './components/project-manager';
  import Scene from './components/scene/Scene.svelte';
  import { SettingsManager } from './components/settings-manager';
  import { lazyLoad } from './helpers';

  let nodeSystemWrapper: HTMLDivElement;
  let projectManager: ProjectManager;
  let showPM = false;
  $: pmLoad = pmLoad || showPM || false;
  let sShow = false;
  $: sLoad = sLoad || sShow || false;
  const settingsManager = new SettingsManager();

  let activeProject: Writable<PlantProject | undefined>;

  onMount(async () => {
    await settingsManager.loadFromLocal();

    const nodeSystem = new NodeSystem({
      wrapper: nodeSystemWrapper,
      view: true,
      defaultNodes: false,
      registerNodes: Nodes,
    });

    projectManager = new ProjectManager(nodeSystem, settingsManager);
    activeProject = projectManager.activeProject;
  });
</script>

<Alert />

<header>
  <div class="left">
    <ClickOutside on:clickoutside={() => (showPM = false)}>
      <div class="project-wrapper" class:active={showPM}>
        <Button
          icon="Cog"
          name="Projects"
          cls="projects-icon"
          bind:active={showPM}
        />
        {#if projectManager && pmLoad}
          {#await lazyLoad('pmv') then ProjectManagerView}
            <svelte:component
              this={ProjectManagerView}
              pm={projectManager}
              visible={showPM}
              on:close={() => (showPM = false)}
            />
          {/await}
        {/if}
      </div>
    </ClickOutside>
  </div>

  <h3>{$activeProject?.meta.name ?? ''}</h3>

  <div class="right">
    <ClickOutside on:clickoutside={() => (sShow = false)}>
      <div class="settings-wrapper" class:active={sShow}>
        <Button icon="Cog" cls="settings-icon" bind:active={sShow} />

        {#if settingsManager && sLoad}
          {#await lazyLoad('smv') then SettingsManagerView}
            <svelte:component
              this={SettingsManagerView}
              sm={settingsManager}
              visible={sShow}
              on:close={() => (sLoad = false)}
            />
          {/await}
        {/if}
      </div>
    </ClickOutside>
  </div>
</header>
<main>
  <Scene pm={projectManager} sm={settingsManager} />
  <div id="nodesystem-view" bind:this={nodeSystemWrapper} />
</main>

<style lang="scss">
  @import './themes.scss';
  main {
    height: 100%;
    max-height: calc(100vh - 50px);
    display: grid;
    grid-template-columns: minmax(50vw, 25%) 1fr;
  }

  h3 {
    color: $light-green;
  }

  header {
    display: flex;
    z-index: 2;
    align-items: center;
    justify-content: space-between;
  }

  .settings-wrapper {
    position: relative;
    z-index: 2;
  }

  .settings-wrapper,
  .project-wrapper {
    &.active {
      filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }
  }
</style>
