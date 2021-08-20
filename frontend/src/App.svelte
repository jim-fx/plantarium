<script lang="ts">
  import { ThemeProvider } from '@plantarium/theme';
  import { AlertWrapper, ToastWrapper } from '@plantarium/ui';
  import { onMount } from 'svelte';
  import { nodeSystem } from './components';
  import Scene from './components/scene/Scene.svelte';
  import { TutorWrapper } from './components/tutor';
  import Header from './Header.svelte';

  let nodeSystemWrapper: HTMLElement;

  onMount(async () => {
    nodeSystemWrapper.append(nodeSystem.view.wrapper);
    nodeSystem.view.handleResize();
  });
</script>

<ThemeProvider />
<AlertWrapper />
<ToastWrapper />
<TutorWrapper />

<Header />

<main>
  <Scene />
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
