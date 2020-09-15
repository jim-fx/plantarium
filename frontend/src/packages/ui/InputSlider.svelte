<script>
  // Styling
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let value = 50;

  let isActive = false;
  let timeout;

  function handleInput(e) {
    const event = new CustomEvent('change', {
      detail: parseFloat(value),
      bubbles: true,
      cancelable: true,
      composed: true, // makes the event jump shadow DOM boundary
    });
    this.dispatchEvent(event);
  }
</script>

<style>
  div {
    position: relative;
    margin: 0px;
    margin-bottom: 12px;
    padding-top: 6px;
  }

  input[type='range'] {
    position: absolute;
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    margin: 0;
  }
  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #4b4b4b;
    border-radius: 1.4px;
  }
  input[type='range']::-webkit-slider-thumb {
    height: 8px;
    width: 8px;
    border-radius: 50px;
    background: #4b4b4b;
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
    height: 8px;
    width: 8px;
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
    border-radius: 2.8px;
  }
  input[type='range']::-ms-fill-upper {
    background: #4b4b4b;
    border-radius: 2.8px;
  }
  input[type='range']::-ms-thumb {
    height: 8px;
    width: 8px;
    border-radius: 50px;
    background: #4b4b4b;
    cursor: pointer;
    height: 2px;
  }
  input[type='range']:focus::-ms-fill-lower {
    background: #4b4b4b;
  }
  input[type='range']:focus::-ms-fill-upper {
    background: #585858;
  }

  output {
    position: absolute;
    display: inline;
    pointer-events: none;
    font-size: 0.7em;
    color: #cccccc;
    text-shadow: 0px 0px 2px black;
    top: -1.2em;
    opacity: 0;
    transform: translateY(5px);
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  div:hover > output {
    transform: translateY(0px);
    opacity: 1;
  }
</style>

<!-- 
This tells the Svelte compiler that this file is a custom element. 
We also have to include the "customElement: true" compiler setting in rollup configuration.
-->
<svelte:options tag="plant-slider" />
<div>
  <output
    class:isActive
    style={`left: ${((value - min) / Math.abs(min - max)) * 90}%`}>
    {value}
  </output>

  <input
    type="range"
    on:focus={() => (isActive = true)}
    on:blur={() => (isActive = false)}
    on:input={handleInput}
    bind:value
    {min}
    {step}
    {max} />
</div>
