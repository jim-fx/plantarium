<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let value = undefined;
  let open = false;
  let main;

  $: value && dispatch('change', value);

  function handleOpen() {
    open = true;
    setTimeout(() => {
      document.addEventListener(
        'click',
        () => {
          open = false;
        },
        { once: true },
      );
    }, 50);
  }

  function setSelected(v) {
    value = v;
    open = false;
  }

  export let values = [];
  export function setItems(_items) {
    values = _items;
  }

  export function setValue(v) {
    value = v;
  }
</script>

<style>
  #main {
    color: white;
    max-width: 200px;
    box-sizing: border-box;
  }

  #selected-value {
    padding: 0px 2px;
  }

  #item-wrapper {
    position: absolute;
    width: 100%;
    background-color: #4b4b4b;
    border-radius: 2px;
    overflow: hidden;
    top: 0;
    z-index: 99;
    left: 0;
  }

  .item {
    padding: 10px;
    margin: 0;
    background-color: #4b4b4b;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .item:hover {
    background-color: #3d3d3d;
  }
</style>

<svelte:options tag="plant-select" />

<plant-component padding="10px">
  <div id="main" bind:this={main}>
    {#if value !== undefined}
      <div id="selected-value" on:click={handleOpen}>{value}</div>
    {:else}
      <div id="selected-value" on:click={handleOpen}>none</div>
    {/if}

    {#if open}
      <div id="item-wrapper">
        {#each values as item}
          <p
            style={`opacity: ${item === value ? 0.5 : 1}`}
            class="item"
            on:click={() => setSelected(item)}>
            {item}
          </p>
        {/each}
      </div>
    {/if}
  </div>
</plant-component>
