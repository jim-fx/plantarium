<script>
  // Styling
  export let value = false;

  let el;

  function dispatchEvent() {
    // 1. Create the custom event.
    const event = new CustomEvent('change', {
      detail: !!value,
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    // 2. Dispatch the custom event.
    el && el.dispatchEvent(event);
  }

  $: value !== undefined && dispatchEvent();
</script>

<style>
  input[type='checkbox'] {
    visibility: hidden;
    position: absolute;
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
</style>

<svelte:options tag="plant-checkbox" />

<div>
  <!-- <span class="tooltip-text">Enables syncing of projects to the cloud</span> -->

  <input type="checkbox" />

  <label class="checkbox-label" for="checkbox-id-5">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>cross</title>
      <line
        vector-effect="non-scaling-stroke"
        class="b0ff5687-6367-498c-a1f2-615cbbb6ed44"
        x1="27.84"
        y1="74.16"
        x2="72.16"
        y2="29.84" />
      <line
        vector-effect="non-scaling-stroke"
        class="b0ff5687-6367-498c-a1f2-615cbbb6ed44"
        x1="27.84"
        y1="29.99"
        x2="72.16"
        y2="74.01" />
    </svg>
  </label>
</div>
