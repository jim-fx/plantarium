<script lang="ts">
  import type { SettingsManager } from '.';

  export let sm: SettingsManager;

  sm.on('settings', (settings: PlantariumSettings) => {
    console.log(settings);
  });
</script>
