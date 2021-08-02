<script lang="ts">
  import Scene from '.';
  import type { ProjectManager } from '../project-manager';

  export let pm: ProjectManager;

  let canvas: HTMLCanvasElement;

  let scene;

  $: if (canvas && pm && !scene) scene = new Scene(pm, canvas);

  let unsub;
  $: if (pm) {
    unsub && unsub();
    pm.on('plant', (plant) => console.log(plant));
  }
</script>

<div class="scene-wrapper">
  <code><pre>Diiiiiide</pre></code><canvas bind:this={canvas} />
</div>

<style>
  code {
    position: absolute;
    right: 0;
  }
  .scene-wrapper {
    position: relative;
  }
</style>
