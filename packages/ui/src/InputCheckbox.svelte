<svelte:options tag="plant-checkbox" accessors />

<script lang="ts">
  import createId from 'shortid';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let fullWidth = false;
  export let value = false;

  export let id = createId();

  $: value !== undefined && dispatch('change', !!value);
</script>

<div class="component-wrapper" class:fullWidth={fullWidth && false}>
  <!-- <span class="tooltip-text">Enables syncing of projects to the cloud</span> -->
  <input type="checkbox" bind:checked={value} {id} />
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="checkbox-label" for={id}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>cross</title>
      <line
        vector-effect="non-scaling-stroke"
        class="b0ff5687-6367-498c-a1f2-615cbbb6ed44"
        x1="0"
        y1="100"
        x2="100"
        y2="0"
      />
      <line
        vector-effect="non-scaling-stroke"
        class="b0ff5687-6367-498c-a1f2-615cbbb6ed44"
        x1="0"
        y1="0"
        x2="100"
        y2="100"
      />
    </svg>
  </label>
</div>

<style lang="scss">
  @import './global.scss';

  input[type='checkbox'] {
    opacity: 0;
    position: absolute;

    &:checked + label > svg {
      opacity: 1;
    }
  }

  svg {
    width: 12px;
    height: 12px;
    opacity: 0;
    margin: 2px;
    stroke: white;
    stroke-width: 2px;
    pointer-events: none;
    margin-left: 4px;
    margin-top: 4px;
  }

  label {
    height: 21px;
    width: 21px;
    position: absolute;
    cursor: pointer;
  }

  .component-wrapper {
    width: 21px;
    height: 21px;
  }
</style>
