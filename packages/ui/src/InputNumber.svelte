<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Styling
  export let min = -Infinity;
  export let max = Infinity;
  export let step = 1;
  export let value = 50;

  let el;

  function handleChange(change) {
    value = Math.max(min, Math.min(value + change, max));
  }

  function dispatchEvent() {
    // 1. Create the custom event.
    const event = new CustomEvent('change', {
      detail: value,
      bubbles: true,
      cancelable: true,
      composed: true, // makes the event jump shadow DOM boundary
    });

    // 2. Dispatch the custom event.
    el && el.dispatchEvent(event);
  }

  $: value !== undefined && dispatchEvent();
</script>

<style>
  input[type='number'] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  div {
    position: relative;
    width: 100%;
    display: flex;
    background-color: #4b4b4b;
    border-radius: 2px;

    font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Oxygen-Sans', Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  div,
  div * {
    box-sizing: border-box;
  }

  div button {
    outline: none;
    background-color: transparent;
    border: none;
    width: 10%;
    cursor: pointer;
    margin: 0;
    margin: 0 2%;
    position: relative;
  }

  div button:before,
  div button:after {
    display: inline-block;
    position: absolute;
    content: '';
    width: 80%;
    height: 1.5px;
    background-color: white;
    border-radius: 4px;
    transform: translate(-50%, -50%);
  }
  div button.plus:after {
    transform: translate(-50%, -50%) rotate(90deg);
  }

  div input[type='number'] {
    color: white;
    background-color: transparent;
    padding: 8%;
    width: 72%;
    font-size: 0.6em;
    font-weight: bold;
    text-align: center;
    border: none;
    border-style: none;
  }
</style>

<!-- 
This tells the Svelte compiler that this file is a custom element. 
We also have to include the "customElement: true" compiler setting in rollup configuration.
-->
<svelte:options tag="plant-number" />
<div>
  <button on:click={() => handleChange(-step)} />

  <input bind:this={el} bind:value {step} {max} {min} type="number" />

  <button on:click={() => handleChange(+step)} class="plus" />
</div>
