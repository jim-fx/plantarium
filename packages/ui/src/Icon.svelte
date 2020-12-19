<script lang="ts">
  import * as icons from './icons';

  export let name: string = 'stem';

  export let active = false;

  const icon = name in icons ? icons[name] : name + ' icon not found';
</script>

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

<svelte:options tag="plant-icon" />

<div class="icon-wrapper" class:active>
  {@html icon}
</div>
