<script>
  import { createEventDispatcher } from 'svelte';
  import createId from 'shortid';
  const dispatch = createEventDispatcher();

  export let value = false;

  const id = createId();

  $: value !== undefined && dispatch('change', !!value);
</script>

<style>
  input[type='checkbox'] {
    opacity: 0;
    cursor: pointer;
    position: absolute;
  }

  svg {
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
  }

  input:checked + label > svg {
    opacity: 1;
  }

  label {
    padding-left: 0px !important;
    padding: 2px;
    cursor: pointer;
  }

  div {
    position: relative;
    width: 100%;
    display: flex;
    background-color: #4b4b4b;
    border-radius: 2px;

    width: 20px;
    height: 20px;

    font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Oxygen-Sans', Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  div,
  div * {
    box-sizing: border-box;
  }
</style>

<div>
  <!-- <span class="tooltip-text">Enables syncing of projects to the cloud</span> -->
  <input type="checkbox" bind:checked={value} {id} />
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="checkbox-label" for={id}>
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
