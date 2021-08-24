<script lang="ts">
  import type { Writable } from 'svelte/store';
  import Scene from '.';
  import { projectManager, settingsManager } from '..';

  let canvas: HTMLCanvasElement;

  let scene: Scene;
  let pd;

  $: if (canvas && projectManager && !scene)
    scene = new Scene(projectManager, canvas);

  $: isLoading = scene && scene.isLoading;

  let unsub;
  $: if (projectManager) {
    unsub && unsub();
    unsub = projectManager.on('save', (plant) => (pd = plant));
  }
  let settings: Writable<PlantariumSettings>;
  $: if (settingsManager) {
    settings = settingsManager.store;
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

	.scene-wrapper::before{
		content: "";
		position:absolute;
		width: 100%;
		height:100%;
		z-index: 1;
		pointer-events:none;
		background: radial-gradient(circle, rgba(2, 0, 36, 0) 50%, rgb(0, 0, 0,0.4) 100%);
	}

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
