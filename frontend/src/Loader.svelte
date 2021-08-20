<script lang="ts">
  import App from './App.svelte';
  import components, { settingsManager } from './components';
</script>

{#await settingsManager.loadFromLocal()}
  <p>Loading</p>
{:then _}
  <App {...components} />
{/await}
