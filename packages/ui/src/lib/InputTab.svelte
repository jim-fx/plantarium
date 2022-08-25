<svelte:options accessors />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ change: string }>();

  export let value: string = '';
  export let values: string[] = [];

  $: value && dispatch('change', value);

  function setSelected(v: string) {
    value = v;
  }

  export function setItems(_items: string[]) {
    values = _items;
  }

  export function setValue(v: string) {
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
</style>
