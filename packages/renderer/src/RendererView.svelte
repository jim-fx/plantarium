<script lang="ts">
  import { onMount } from 'svelte';
  import Renderer from './Renderer';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    new Renderer({ canvas });
  });
</script>

<canvas bind:this={canvas} class:resizing={false} />

<style>
  canvas {
    width: 100% !important;
    height: 100% !important;
    filter: blur(0px);
    transition: filter 0.2s ease;
  }

  canvas.resizing {
    filter: blur(5px);
  }
</style>
