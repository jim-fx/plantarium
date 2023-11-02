<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface SearchEntry {
    value: string;
    title?: string;
    group?: string;
  }
  const dispatch = createEventDispatcher();
  const amountSelects: Record<string, number> = {};

  export let limitAmount = 10;
  export let values: SearchEntry[] = [];

  let inputEl: HTMLInputElement;
  let searchTerm = '';
  $: filteredItems = search(values, searchTerm.toLowerCase());
  $: selectedValue = '';

  function search(items: SearchEntry[], searchTerm: string): SearchEntry[] {
    if (!searchTerm?.length) return items;
    const filtered = items.filter((i) => {
      if (i.value.includes(searchTerm)) return true;
      if (i.title && i.title.toLowerCase().includes(searchTerm)) return true;
      return false;
    });

    if (!filtered.length) {
      return [
        {
          value: 'Nothing Found'
        }
      ];
    }

    const activeItem = filtered.find((v) => v.value === selectedValue);
    if (!activeItem) {
      selectedValue = filtered[0].value;
    }

    return filtered;
  }

  export function focus() {
    searchTerm = '';
    inputEl.focus();
  }

  export function clear() {
    searchTerm = '';
  }

  function handleSelect({ value = selectedValue }: SearchEntry = { value: selectedValue }) {
    amountSelects[value] = amountSelects[value] + 1 || 1;
    dispatch('input', value);
  }

  function handleIndexChange(dir: number) {
    if (!selectedValue.length) {
      selectedValue = filteredItems[0].value;
      return;
    }

    const item = filteredItems.slice(0, limitAmount).find((i) => i.value === selectedValue);

    if (!item) return;

    const index = filteredItems.indexOf(item);

    const length = Math.min(filteredItems.length, limitAmount);
    const nextIndex = (((index + dir) % length) + length) % length;

    selectedValue = filteredItems[nextIndex].value;
  }

  function handleKeyDown({ key }: KeyboardEvent) {
    if (key === 'Enter' && selectedValue.length) {
      handleSelect();
    }

    if (key === 'ArrowDown') {
      handleIndexChange(1);
    }

    if (key === 'ArrowUp') {
      handleIndexChange(-1);
    }
  }

  function setActive(v: SearchEntry) {
    selectedValue = v.value;
  }

  export const setItems = (items: SearchEntry[]) => {
    values = items;
  };
</script>

<svelte:window on:keydown={handleKeyDown} />
<div class="search-wrapper">
  <input type="text" placeholder="Search" bind:this={inputEl} bind:value={searchTerm} />
  {#each filteredItems as v, i}
    {#if i < limitAmount}
      <div
        class="search-entry"
        on:focus={() => setActive(v)}
        on:mouseover={() => setActive(v)}
        on:click={() => handleSelect(v)}
        class:focused={v.value === selectedValue}
      >
        {v.title || v.value}
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .search-wrapper {
    padding: 5px;
    z-index: 2;
    width: 100px;
    background-color: var(--foreground-color);
    border-radius: var(--border-radius, 3px);
    color: #707070;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.13), 1px 2px 2px rgba(0, 0, 0, 0.1),
      -1px -2px 2px rgba(0, 0, 0, 0.05);

    input {
      color: var(--outline-color);
      width: 100%;
      background-color: rgba(var(--light-gray), 0.4);
      box-sizing: border-box;
      font-size: 1.5em;
      padding: 3px 10px;
      margin: 0;
      font-weight: lighter;
      outline: none !important;
      border: none;

      &::placeholder {
        color: var(--outline-color);
      }
    }
  }

  .search-entry {
    padding: 5px;
    width: 100%;
    border-radius: 5px;
    box-sizing: border-box;
    &.focused {
      background: var(--green-gradient);
      color: var(--dark-gray);
    }
  }
</style>
