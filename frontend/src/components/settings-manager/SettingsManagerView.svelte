<script lang="ts">
  import type { SettingsManager } from '.';
  import SettingsSection from './SettingsSection.svelte';
  import SettingsTemplate from './SettingsTemplate';

  export let sm: typeof SettingsManager;
  export let visible = false;

  const store = sm.store;
</script>

<div class="wrapper" class:visible>
  {#each Object.entries($store) as [key, value]}
    <SettingsSection {sm} {key} {value} template={SettingsTemplate[key]} />
  {/each}
</div>

<style lang="scss">
  @use '~@plantarium/theme/src/themes.module.scss';
  .wrapper {
    position: absolute;
    right: 0px;
    width: fit-content;
    background-color: themes.$light-green;
    opacity: 0;
    pointer-events: none;
    resize: both;
    border-radius: 5px 0px 5px 5px;
    padding: 10px;
    padding-left: 0px;

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
