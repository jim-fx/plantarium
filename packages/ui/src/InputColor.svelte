<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  // Styling
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let value = 50;

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
