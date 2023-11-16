<svelte:options accessors />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ change: string }>();

  export let value: string | null = null;
  let open = false;

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

  function setSelected(v: string) {
    value = v;
    open = false;
  }

  export let values: string[] = [];
  export function setItems(_items: string[]) {
    values = _items;
    if (!value || !values.includes(value)) {
      value = values[0];
    }
  }

  export function setValue(v: string) {
    value = v;
  }
</script>

<div class="component-wrapper" class:open>
  <div id="main">
    {#if value !== undefined}
      <button id="selected-value" on:click={handleOpen} on:keydown={handleOpen}>{value}</button>
    {:else}
      <button id="selected-value" on:click={handleOpen} on:keydown={handleOpen}>none</button>
    {/if}

    <div id="item-wrapper">
      {#each values as item}
        {#if item !== value}
          <button
            style={`opacity: ${item === value ? 0.5 : 1}`}
            class="item"
            on:keydown={() => setSelected(item)}
            on:click={() => setSelected(item)}
          >
            {item}
          </button>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @import './global.scss';

  .component-wrapper {
    border-radius: var(--border-radius, 2px);
    height: 27px;
  }

  button {
    color: var(--text-color);
    font-family: Nunito Sans, sans-serif;
    background-color: transparent;
    cursor: pointer;
    border: none;
    display: block;
    width: 100%;
    font-size: 1em;
    padding: var(--padding, 6px);
    padding-inline: 10px;
  }

  .open.component-wrapper {
    overflow: visible;
    z-index: 99;
  }

  #main {
    color: var(--text-color);
    min-width: 100%;
    border-radius: var(--border-radius, 2px);
    width: fit-content;
    box-sizing: border-box;
    background-color: var(--foreground-color);
    cursor: pointer;
  }
  .open #main {
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
  }

  #item-wrapper {
    width: fit-content;
    min-width: 100%;
    border-radius: var(--border-radius);

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
    padding: var(--padding, 6px);
    margin: 0;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .item:hover {
    background-color: var(--outline-color);
  }
</style>
