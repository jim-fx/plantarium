<script lang="ts">
  import * as icons from './icons';

  export let name: string;

  export let active = false;

  const icon = name in icons ? icons[name] : 'not found';
</script>

<style>
  .icon-wrapper {
    height: 100%;
    width: fit-content;
    box-sizing: border-box;
  }

  .active :global(*) {
    stroke: red;
  }

  .icon-wrapper :global(svg > *) {
    transition: stroke 0.1s ease;
  }
</style>

<div class="icon-wrapper" class:active>
  {@html icon}
</div>
