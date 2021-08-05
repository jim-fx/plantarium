<svelte:options tag="plant-number" accessors />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Styling
  export let min = -Infinity;
  export let max = Infinity;
  export let step = 1;
  export let value = 0;

  export let fullWidth = false;

  function handleChange(change) {
    value = Math.max(min, Math.min(+value + change, max));
  }

  $: value !== undefined && dispatch('change', parseFloat(value + ''));
</script>

<div class="component-wrapper" class:fullWidth>
  <div>
    <button on:click={() => handleChange(-step)} />

    <input
      bind:value
      {step}
      {max}
      {min}
      type="number"
      style={`width:${Math.max((value?.toString().length ?? 1) * 8, 30)}px;`}
    />

    <button on:click={() => handleChange(+step)} class="plus" />
  </div>
</div>

<style lang="scss">
  @import './global.scss';
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
    box-sizing: border-box;
    max-width: 200px;
    position: relative;
    width: fit-content;
    display: flex;
    background-color: #4b4b4b;
    border-radius: 2px;

    padding: 3px 1px;
    padding-right: 6px;
    padding-left: 4px;

    font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Oxygen-Sans', Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
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
    background-color: rgb(190, 190, 190);
    border-radius: 4px;
    transform: translate(-50%, -50%);
  }
  div button.plus:after {
    transform: translate(-50%, -50%) rotate(90deg);
  }

  div input[type='number'] {
    color: white;
    background-color: transparent;
    padding: 2px;
    width: 72%;
    font-weight: bold;
    text-align: center;
    border: none;
    border-style: none;
  }
</style>
