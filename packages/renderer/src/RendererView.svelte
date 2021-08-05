<script lang="ts">
  import { onMount } from 'svelte';
  import Renderer from './Renderer';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    new Renderer(canvas);
  });
</script>

<canvas bind:this={canvas} />
