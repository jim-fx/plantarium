<script context="module" lang="ts">
  import * as icons from './icons';

  export type IconType = keyof typeof icons;
</script>

<script lang="ts">
  export let name: IconType = 'triangle';

  export let active = false;
  export let dark = false;
  export let circle = false;
  export let hover = false;
  export let animated = false;
  export let animateIn = false;

  $: icon = name in icons ? icons[name] : name.toString() + ' icon not found';
</script>

<div class="icon-wrapper" class:active class:dark class:circle class:animated>
  {#if typeof icon === 'string'}
    {@html icon}
  {:else}
    <svelte:component this={icon} {animated} {active} animIn={animateIn} {hover} />
  {/if}
</div>

<style lang="scss">
  .icon-wrapper {
    width: var(--width, fit-content);
    height: var(--height, fit-content);
    object-fit: cover;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    min-width: 20px;
    min-height: 20px;

    &.circle {
      border-radius: 50%;
      padding: 5px;
      border: solid 2px white;
    }
  }

  .circle::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  .dark.circle {
    border-color: #303030;
  }

  .icon-wrapper > :global(svg > *) {
    stroke: var(--text-color, white);
    fill: var(--fill, none);
  }

  .icon-wrapper > :global(svg) {
    width: 100%;
    height: var(--height, fit-content);
  }

  .active :global(*) {
    color: var(--text-color, white);
  }

  .dark :global(*) {
    stroke: #303030 !important;
  }
  .icon-wrapper :global(svg > *) {
    transition: stroke 0.1s ease;
    stroke-width: 5px;
  }
</style>
