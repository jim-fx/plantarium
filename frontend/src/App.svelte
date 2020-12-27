<script lang="ts">
  import { onMount } from 'svelte';
  import ClickOutside from 'svelte-click-outside';

  // Model components
  import { NodeSystem } from '@plantarium/nodesystem';
  import Nodes from '@plantarium/nodes';
  import { Button, Alert } from '@plantarium/ui';
  import { lazyLoad } from './helpers';

  // View components
  import { ProjectManager } from './components/project-manager';
  import { SettingsManager } from './components/settings-manager';
  import Scene from './components/scene/Scene.svelte';

  let nodeSystemWrapper: HTMLDivElement;
  let projectManager: ProjectManager;
  let showPM = false;
  $: pmLoad = pmLoad || showPM || false;
  let sShow = false;
  $: sLoad = sLoad || sShow || false;
  const settingsManager = new SettingsManager();

  onMount(() => {
    const nodeSystem = new NodeSystem({
      wrapper: nodeSystemWrapper,
      view: true,
      defaultNodes: false,
      registerNodes: (Nodes as unknown) as NodeTypeData[],
    });

    projectManager = new ProjectManager(nodeSystem, settingsManager);
  });
</script>

<style lang="scss">
  main {
    height: 100%;
    display: grid;
    grid-template-columns: minmax(50vw, 25%) 1fr;
  }

  header {
    display: flex;
    z-index: 2;
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

<Alert />

<header>
  <div class="left">
    <ClickOutside on:clickoutside={() => (showPM = false)}>
      <div class="project-wrapper" class:active={showPM}>
        <Button
          icon="Cog"
          name="Projects"
          cls="projects-icon"
          bind:active={showPM} />
        {#if projectManager && pmLoad}
          {#await lazyLoad('pmv') then ProjectManagerView}
            <svelte:component
              this={ProjectManagerView}
              pm={projectManager}
              visible={showPM}
              on:close={() => (showPM = false)} />
          {/await}
        {/if}
      </div>
    </ClickOutside>
  </div>

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
              on:close={() => (sLoad = false)} />
          {/await}
        {/if}
      </div>
    </ClickOutside>
  </div>
</header>
<main>
  <Scene pm={projectManager} />
  <div id="nodesystem-view" bind:this={nodeSystemWrapper} />
</main>
