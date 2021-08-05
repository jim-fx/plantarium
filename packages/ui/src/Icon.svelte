<svelte:options tag="plant-icon" />

<script lang="ts">
  import * as icons from './icons/index.ts';

  export let name = 'stem';
  name = name.toLowerCase();

  export let active = false;

  const icon = name in icons ? icons[name] : name + ' icon not found';
</script>

<div class="icon-wrapper" class:active>
  {@html icon}
</div>

<style>
  .icon-wrapper {
    height: 100%;
    width: fit-content;
    box-sizing: border-box;

    min-width: 20px;
    min-height: 20px;
  }

  .active :global(*) {
    stroke: red;
  }

  .icon-wrapper :global(svg > *) {
    transition: stroke 0.1s ease;
  }
</style>
