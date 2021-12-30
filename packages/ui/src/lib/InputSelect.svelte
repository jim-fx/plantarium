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
        { once: true }
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

<div class="component-wrapper" class:open>
  <div id="main" bind:this={main}>
    {#if value !== undefined}
      <div id="selected-value" on:click={handleOpen}>{value}</div>
    {:else}
      <div id="selected-value" on:click={handleOpen}>none</div>
    {/if}

    <div id="item-wrapper">
      {#each values as item}
        {#if item !== value}
          <p
            style={`opacity: ${item === value ? 0.5 : 1}`}
            class="item"
            on:click={() => setSelected(item)}
          >
            {item}
          </p>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @import './global.scss';

  .component-wrapper {
    height: 30px;
  }

  .open.component-wrapper {
    overflow: visible;
    z-index: 99;
  }

  #main {
    color: white;
    min-width: 100%;
    border-radius: 2px;
    width: fit-content;
    box-sizing: border-box;
    background-color: #4b4b4b;
    cursor: pointer;
  }
  .open #main {
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
  }

  #selected-value {
    padding: 6px 10px;
    padding-left: 6px;
    height: auto;
  }

  #item-wrapper {
    width: fit-content;
    min-width: 100%;
    background-color: #4b4b4b;
    border-radius: 2px;

    overflow: hidden;
    top: 0;
    z-index: 99;
    left: 0;

    height: 0px;
  }

  .open #item-wrapper {
    height: auto;
  }

  .item {
    padding: 6px;
    margin: 0;
    background-color: #4b4b4b;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .item:hover {
    background-color: #3d3d3d;
  }
</style>
