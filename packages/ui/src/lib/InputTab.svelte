<svelte:options accessors />

<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let value = undefined;

  $: value && dispatch('change', value);

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

<div class="component-wrapper">
  <div id="main">
    {#each values as item}
      <p
        style={`opacity: ${item === value ? 0.5 : 1}`}
        class="item"
        class:selected={value === item}
        on:click={() => setSelected(item)}
      >
        {item}
      </p>
    {/each}
  </div>
</div>

<style lang="scss">
  @import './global.scss';

  .component-wrapper {
    overflow: hidden;
    border-radius: 3px;
  }

  #main {
    display: flex;
    min-width: 100%;
    overflow: hidden;
    width: fit-content;
    justify-content: space-evenly;
    box-sizing: border-box;
    cursor: pointer;
  }

  .item {
    flex: 1;
    text-align: center;
    padding: 6px;
    margin: 0;
    cursor: pointer;
    color: var(--text-color);
    background-color: var(--foreground-color);
    transition: background-color 0.2s ease;
  }

  .selected {
    background-color: var(--text-color);
    color: var(--foreground-color);
  }

  #item-wrapper {
    width: fit-content;
    min-width: 100%;
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
</style>
