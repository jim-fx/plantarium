<script lang="ts">
  import type { SettingsManager } from '.';

  export let sm: SettingsManager;

  sm.on('settings', (settings: PlantariumSettings) => {
    console.log(settings);
  });
</script>

<style lang="scss">
  @import '../../themes.scss';
  .wrapper {
    position: relative;
    margin-top: -8px;
    width: fit-content;
    background-color: $light-green;
    opacity: 0;
    pointer-events: none;
    resize: both;
    border-radius: 0px 5px 5px 5px;

    margin-bottom: 8px;

    resize: both;
    overflow: auto;
    min-width: 300px;
    overflow-x: hidden;
    min-height: 100px;
    max-height: 70vh;
    max-width: 500px;
  }
</style>

<div class="wrapper">//</div>
