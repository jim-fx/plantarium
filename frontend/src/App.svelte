<script lang="ts">
  import type { NodeSystem } from '@plantarium/nodesystem';
  import { ThemeProvider } from '@plantarium/theme';
  import { AlertWrapper, ToastWrapper } from '@plantarium/ui';
  import { onMount } from 'svelte';
  import type { ProjectManager } from './components/project-manager';
  import Scene from './components/scene/Scene.svelte';
  import type { SettingsManager } from './components/settings-manager';
  import { TutorWrapper } from './components/tutor';
  import Header from './Header.svelte';

  export let projectManager: ProjectManager;
  export let settingsManager: SettingsManager;
  export let nodeSystem: NodeSystem;
  let nodeSystemWrapper: HTMLElement;

  onMount(async () => {
    nodeSystemWrapper.append(nodeSystem.view.wrapper);
    nodeSystem.view.handleResize();
  });
</script>

<ThemeProvider />
<AlertWrapper />
<ToastWrapper />
<TutorWrapper {projectManager} />

<Header {projectManager} {settingsManager} />

<main>
  <Scene pm={projectManager} sm={settingsManager} />
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
</style>
