<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Styling
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let value = 50;

  $: alpha = (value - min) / Math.abs(min - max);

  let isActive = false;
</script>

<div>
  <output class:isActive style={`left: ${alpha * 100}%; transform: translateX(-${alpha * 66.66}%)`}>
    {value}
  </output>

  <input
    type="range"
    on:focus={() => (isActive = true)}
    on:blur={() => (isActive = false)}
    on:input={() => dispatch('change', value)}
    bind:value
    {min}
    {step}
    {max}
  />
</div>

<style lang="scss">
  @use 'sass:math';

  div {
    position: relative;
    width: 100%;
    height: 10px;
  }

  input[type='range'] {
    position: absolute;
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    margin: 0;
    height: 10px;
  }
  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: var(--background-color);
    border-radius: 1.4px;
  }
  input[type='range']::-webkit-slider-thumb {
    height: 10px;
    width: 10px;
    border-radius: 50px;
    background: var(--background-color);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -3.2px;
  }

  input[type='range']:hover::-webkit-slider-thumb {
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  }

  input[type='range']:focus::-webkit-slider-runnable-track {
    background: #585858;
  }
  input[type='range']::-moz-range-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #4b4b4b;
    border-radius: 1.4px;
    border: 0px solid rgba(1, 1, 1, 0);
  }
  input[type='range']::-moz-range-thumb {
    height: 10px;
    width: 10px;
    border-radius: 50px;
    background: #4b4b4b;
    cursor: pointer;
  }
  input[type='range']::-ms-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type='range']::-ms-fill-lower {
    background: #3e3e3e;
    border-radius: calc(10px / 2);
  }
  input[type='range']::-ms-fill-upper {
    background: #4b4b4b;
    border-radius: calc(10px / 2);
  }
  input[type='range']::-ms-thumb {
    height: 10px;
    width: 10px;
    border-radius: 50px;
    background: var(--background-color);
    cursor: pointer;
    height: 2px;
  }
  input[type='range']:focus::-ms-fill-lower {
    background: var(--background-color);
  }
  input[type='range']:focus::-ms-fill-upper {
    background: #585858;
  }

  output {
    position: absolute;
    display: inline;
    pointer-events: none;
    color: #cccccc;
    text-shadow: 0px 0px 2px black;
    top: -1.2em;
    opacity: 0;
    top: -15px;
    transition: opacity 0.3s ease, top 0.3s ease;
  }

  div:hover > output {
    top: -25px;
    transform: translateX(-50%);
    opacity: 1;
  }
</style>
