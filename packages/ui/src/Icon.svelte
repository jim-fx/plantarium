<svelte:options tag="plant-icon" />

<script context="module" lang="ts">
  import * as icons from './icons';

  export type IconType = keyof typeof icons;
</script>

<script lang="ts">
  export let name: IconType = 'stem';

  export let active = false;
  export let dark = false;

  const icon = name in icons ? icons[name] : name + ' icon not found';
</script>

<div class="icon-wrapper" class:active class:dark>
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

  .icon-wrapper > :global(*) {
    stroke: var(--color, white);
  }

  .active :global(*) {
    color: var(--text-color, white);
  }

  .dark :global(*) {
    stroke: #303030;
    color: var(--text-color, white);
  }
  .icon-wrapper :global(svg > *) {
    transition: stroke 0.1s ease;
  }
</style>
