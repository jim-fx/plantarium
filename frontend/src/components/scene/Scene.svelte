<script lang="ts">
  import type { ProjectManager } from '../project-manager';
  import Scene from '.';

  export let pm: ProjectManager;

  let canvas: HTMLCanvasElement;

  let scene;

  $: if (canvas && pm && !scene) scene = new Scene(pm, canvas);
</script>

<div class="scene-wrapper"><canvas bind:this={canvas} /></div>
