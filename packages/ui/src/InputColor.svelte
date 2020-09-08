<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  let main;

  function handleChange() {
    // 1. Create the custom event.
    const event = new CustomEvent('change', {
      detail: +el.value,
      bubbles: true,
      cancelable: true,
      composed: true, // makes the event jump shadow DOM boundary
    });

    // 2. Dispatch the custom event.
    this.dispatchEvent(event);
  }
</script>

<style>
  #main {
    position: relative;
    width: 100%;
  }
</style>

<svelte:options tag="plant-color" />
<div id="main" bind:this={main}>
  <HsvPicker on:colorChange={handleCh} startColor={'#FBFBFB'} />
</div>
