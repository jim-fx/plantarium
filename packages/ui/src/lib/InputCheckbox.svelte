<svelte:options accessors />

<script lang="ts">
  import createId from 'shortid';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let value = false;
  export let label: string;

  export let id = createId();

  $: value !== undefined && dispatch('change', !!value);
</script>

<div class="component-wrapper">
  <!-- <span class="tooltip-text">Enables syncing of projects to the cloud</span> -->
  <input type="checkbox" bind:checked={value} {id} />
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="checkbox-label" for={id}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>cross</title>
      <line vector-effect="non-scaling-stroke" x1="0" y1="100" x2="100" y2="0" />
      <line vector-effect="non-scaling-stroke" x1="0" y1="0" x2="100" y2="100" />
    </svg>
  </label>
  {#if label}
    <p>{label}</p>
  {/if}
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

  p {
    margin-left: 25px;
  }

  svg {
    height: 80%;
    width: 80%;
    margin-left: 10%;
    margin-top: 10%;
    opacity: 0;
    stroke: var(--text-color);
    stroke-width: 2px;
    pointer-events: none;
  }

  label {
    position: absolute;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .component-wrapper {
    width: 21px;
    height: 21px;
  }
</style>
