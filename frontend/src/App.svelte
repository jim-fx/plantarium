<script lang="ts">
  import Nodes from '@plantarium/nodes';
  import { NodeSystem } from '@plantarium/nodesystem';
  import {
    Button,
    createToast,
    ToastWrapper,
    AlertWrapper,
  } from '@plantarium/ui';
  import { onMount } from 'svelte';
  import ClickOutside from 'svelte-click-outside';
  import type { Writable } from 'svelte/store';
  import { ProjectManager } from './components/project-manager';
  import Scene from './components/scene/Scene.svelte';
  import { SettingsManager } from './components/settings-manager';
  import { lazyLoad } from './helpers';
  import { setTheme, ThemeStore, ThemeProvider } from '@plantarium/theme';

  let nodeSystemWrapper: HTMLDivElement;
  let projectManager: ProjectManager;
  let showPM = false;
  $: pmLoad = pmLoad || showPM || false;
  let sShow = false;
  $: sLoad = sLoad || sShow || false;

  let activeProject: Writable<PlantProject | undefined>;

  onMount(async () => {
    await SettingsManager.loadFromLocal();

    setTheme(SettingsManager.get('theme'));

    SettingsManager.on('enableSync.update', (v) => {
      createToast(`${v ? 'Enabled' : 'Disabled'} sync`, { type: 'success' });
    });

    SettingsManager.on('theme.update', (v: string) => {
      setTheme(v);
    });

    const nodeSystem = new NodeSystem({
      wrapper: nodeSystemWrapper,
      view: true,
      defaultNodes: false,
      registerNodes: Nodes,
    });

    projectManager = new ProjectManager(nodeSystem, SettingsManager);
    activeProject = projectManager.activeProject;
  });
</script>

<ThemeProvider />

<AlertWrapper />
<ToastWrapper />

<header>
  <div class="left">
    <ClickOutside on:clickoutside={() => (showPM = false)}>
      <div class="project-wrapper" class:active={showPM}>
        <Button
          icon="folder"
          name="Projects"
          cls="projects-icon"
          --color={$ThemeStore['text-color']}
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
        <Button
          icon="cog"
          cls="settings-icon"
          --color={$ThemeStore['text-color']}
          bind:active={sShow}
        />

        {#if SettingsManager && sLoad}
          {#await lazyLoad('smv') then SettingsManagerView}
            <svelte:component
              this={SettingsManagerView}
              sm={SettingsManager}
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
  <Scene pm={projectManager} sm={SettingsManager} />
  <div id="nodesystem-view" bind:this={nodeSystemWrapper} />
</main>

<style lang="scss">
  @use '~@plantarium/theme/src/themes.module.scss';

  main {
    height: 100%;
    max-height: calc(100vh - 50px);
    display: grid;
    grid-template-columns: minmax(50vw, 25%) 1fr;
  }

  h3 {
    color: themes.$light-green;
  }

  header {
    display: flex;
    z-index: 2;
    align-items: center;
    justify-content: space-between;
    background-color: var(--foreground-color);
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
