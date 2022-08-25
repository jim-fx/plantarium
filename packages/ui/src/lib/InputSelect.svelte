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
    color: var(--text-color);
    min-width: 100%;
    border-radius: 2px;
    width: fit-content;
    box-sizing: border-box;
    background-color: var(--foreground-color);
    cursor: pointer;
  }
  .open #main {
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
  }

  #selected-value {
    padding: 4px 10px;
    padding-left: 6px;
    height: auto;
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

  .item {
    padding: 6px;
    margin: 0;
    cursor: pointer;
    color: var(--text-color);
    transition: background-color 0.2s ease;
  }

  .item:hover {
    background-color: var(--outline-color);
  }
</style>
