<script lang="ts">
  import type { SettingsManager } from '.';
  import SettingsSection from './SettingsSection.svelte';
  import SettingsTemplate from './SettingsTemplate';

  export let sm: SettingsManager;
  export let visible = false;

  const store = sm.store;
</script>

<style lang="scss">
  @import '../../themes.scss';
  .wrapper {
    position: absolute;
    right: 0px;
    width: fit-content;
    background-color: $light-green;
    opacity: 0;
    pointer-events: none;
    resize: both;
    border-radius: 5px 0px 5px 5px;

    margin-bottom: 8px;

    resize: both;
    overflow: auto;
    min-width: 300px;
    overflow-x: hidden;
    min-height: 100px;
    max-height: 70vh;
    max-width: 500px;
  }

  .visible {
    opacity: 1;
    z-index: 2;
    pointer-events: all;
  }
</style>

<div class="wrapper" class:visible>
  {#each Object.entries($store) as [key, value]}
    <SettingsSection {sm} {key} {value} template={SettingsTemplate[key]} />
  {/each}
</div>
