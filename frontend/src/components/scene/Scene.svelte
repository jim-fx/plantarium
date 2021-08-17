<script lang="ts">
  import { Icon } from '@plantarium/ui';

  import Scene from '.';
  import type { ProjectManager } from '../project-manager';
  import type { SettingsManager } from '../settings-manager';

  export let pm: ProjectManager;
  export let sm: typeof SettingsManager;

  let canvas: HTMLCanvasElement;

  let scene: Scene;
  let pd;

  $: if (canvas && pm && !scene) scene = new Scene(pm, canvas);

  $: isLoading = scene && scene.isLoading;

  let unsub;
  $: if (pm) {
    unsub && unsub();
    unsub = pm.on('save', (plant) => (pd = plant));
  }
  let settings: typeof SettingsManager.store;
  $: if (sm) {
    settings = sm.store;
  }
</script>

<div class="scene-wrapper">
  {#if $settings?.debug?.pd && pd}
    <pre>
    <code>
      {JSON.stringify(pd,null,2)}
    </code>
  </pre>
  {/if}

  <canvas bind:this={canvas} />
  {#if $isLoading}
    <div class="is-loading">
      <p>Is Loading</p>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '~@plantarium/theme/src/themes.module.scss';

  canvas {
    width: 100% !important;
    height: 100% !important;
    filter: blur(0px);
    transition: filter 0.3s ease;

    &:global(.resizing) {
      filter: blur(5px);
    }
  }

  .is-loading {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 99;
  }

  pre {
    position: absolute;
    font-size: 0.8em;
    max-height: 100%;
    overflow-y: auto;
    right: 0;
    padding: 10px 20px 10px 0px;
    box-sizing: border-box;
  }

  :global(code[class*='language-'], pre[class*='language-'], .token.operator) {
    background: none !important;
    text-shadow: 0 1px #0000001f;
  }

  :global(.token.string) {
    color: themes.$dark-green;
  }
  .scene-wrapper {
    position: relative;
    max-height: calc(100vh - 50px);
  }
</style>
