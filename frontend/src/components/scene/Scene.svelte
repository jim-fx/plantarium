<script lang="ts">
  import Prism from 'svelte-prismjs';
  import 'prismjs/components/prism-json.js';
  import Scene from '.';
  import type { ProjectManager } from '../project-manager';
  import type { SettingsManager } from '../settings-manager';

  export let pm: ProjectManager;
  export let sm: SettingsManager;

  let canvas: HTMLCanvasElement;

  let scene;
  let pd;

  $: if (canvas && pm && !scene) scene = new Scene(pm, canvas);

  let unsub;
  $: if (pm) {
    unsub && unsub();
    unsub = pm.on('save', (plant) => (pd = plant));
  }
  let settings: SettingsManager['store'];
  $: if (sm) {
    settings = sm.store;
  }
</script>

<!-- 
<svelte:head>
  {@html github}
</svelte:head> -->

<div class="scene-wrapper">
  {#if $settings?.debug?.pd && pd}
    <pre>
    <code>
      <Prism showLineNumbers={true} language="json" code={JSON.stringify(pd, null, 2)} />
    </code>
  </pre>
  {/if}
  <canvas bind:this={canvas} />
</div>

<style lang="scss">
  @import "../../themes.scss";
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

  :global(.token.string){
    color: $dark-green;
  }
  .scene-wrapper {
    position: relative;
  }
</style>
