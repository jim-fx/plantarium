<script lang="ts">
  import { onMount } from 'svelte';

  export let animIn = false;
  let anim = false;
  onMount(() => {
    setTimeout(() => {
      if (animIn) anim = true;
    }, 200);
  });
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class:anim class:animIn>
  <path d="M75.5,30,40.43,72.47a2,2,0,0,1-3.08,0L24.5,57" />
</svg>

<style>
  .animIn > path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
  }

  .anim > path {
    animation: animIn 1s ease forwards;
  }

  @keyframes animIn {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
</style>

