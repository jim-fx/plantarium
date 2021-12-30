<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let open = false;

  export let name = '';

  const toggle = () => {
    open = !open;
    dispatch('toggle', open);
  };
</script>

<div class="wrapper" class:open>
  <div class="header" on:click={toggle}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
    </svg>

    {#if name}
      <div class="border">
        <p>{name}</p>
      </div>
    {/if}
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  p {
    margin: 0px;
  }

  .wrapper {
    width: 100%;
  }

  .content {
    max-height: 0px;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }

  .open > .content {
    opacity: 1;
    max-height: 1000px;
  }

  .header {
    cursor: pointer;
    display: grid;
    grid-template-columns: auto 1fr;
  }

  svg {
    margin-left: -7px;
    margin-top: -2px;
    transform: rotate(0deg);
    transition: transform 0.2s ease, margin-top 0.3s ease;
  }

  .open > .header > svg {
    margin-top: -4px;
    transform: rotate(90deg);
  }

  svg > path {
    stroke: none !important;
    fill: #303030;
  }

  p {
    user-select: none;
  }

  .border {
    padding-bottom: 5px;
    border-bottom: solid thin #30303000;
    transition: padding-bottom 0.3s ease, border-bottom 0.3s ease;
  }

  .open > .header > .border {
    border-bottom: solid thin #30303055;
    padding-bottom: 10px;
  }
</style>
