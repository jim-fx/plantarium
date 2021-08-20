<script lang="ts">
  import App from './App.svelte';
  import { settingsManager } from './components';
</script>

{#await settingsManager.loadFromLocal()}
  <p>Loading</p>
{:then _}
  <App />
{/await}
