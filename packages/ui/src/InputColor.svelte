<script>
  import { HsvPicker } from 'svelte-color-picker';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<style>
  #main {
    position: relative;
    width: 100%;
  }
</style>

<svelte:options tag="plant-color" />

<div id="main">
  <HsvPicker
    on:colorChange={(ev) => dispatch('change', ev)}
    startColor={'#FBFBFB'} />
</div>
