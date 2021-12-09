<svelte:options tag="plant-search" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface SearchEntry {
    value: string;
    title?: string;
    group?: string;
  }

  const amountSelects: Record<string, number> = {};

  function search(items: SearchEntry[], searchTerm: string): SearchEntry[] {
    if (!searchTerm?.length) return items;
    const filtered = items.filter((i) => {
      if (i.value.includes(searchTerm)) return true;
      return false;
    });

    if (!filtered.length) {
      return [
        {
          value: 'Nothing Found',
          amountSelects: 0,
        },
      ];
    }

    const activeItem = filtered.find((v) => v.value === selectedValue);
    if (!activeItem) {
      selectedValue = filtered[0].value;
    }

    return filtered;
  }

  export function show() {}

  export function hide() {}

  export let values: SearchEntry[] = [];

  $: filteredItems = search(values, searchTerm.toLowerCase());

  $: selectedValue = '';

  let searchTerm = '';

  function handleSelect(
    { value = selectedValue }: SearchEntry = { value: selectedValue },
  ) {
    amountSelects[value] = amountSelects[value] + 1 || 1;
    dispatch('input', value);
  }

  function handleKeyDown({ key }) {
    if (key === 'Enter' && selectedValue.length) {
      handleSelect();
    }
  }

  function setActive(v) {
    selectedValue = v.value;
  }

  export const setItems = (items: SearchEntry[]) => {
    values = items;
  };

  const dispatch = createEventDispatcher();
</script>

{JSON.stringify(amountSelects)}

<div class="context-wrapper context-visible" style="left: 252px; top: 260px;">
  <input
    type="text"
    placeholder="Search"
    bind:value={searchTerm}
    on:keydown={handleKeyDown}
  />
  {#each filteredItems as v}
    <div
      class="search-container"
      on:focus={() => setActive(v)}
      on:mouseover={() => setActive(v)}
      on:click={() => handleSelect(v)}
      class:focused={v.value === selectedValue}
    >
      {v.title || v.value}
    </div>
  {/each}
</div>

<style lang="scss">
  @use '~@plantarium/theme/src/themes.module.scss';

  .search-container {
    padding: 5px;
    width: 100%;
    border-radius: 5px;
    box-sizing: border-box;
    &.focused {
      background: themes.$green-gradient;
      color: var(--foreground-color);
    }
  }

  .context-wrapper {
    padding: 5px;
    z-index: 2;
    width: 100px;
    background-color: var(--background-color);
    border-radius: 5px;
    color: #707070;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.13), 1px 2px 2px rgba(0, 0, 0, 0.1),
      -1px -2px 2px rgba(0, 0, 0, 0.05);

    input {
      width: 100%;
      background-color: themes.$light-gray;
      box-sizing: border-box;
      font-size: 1.5em;
      border-radius: 3px;
      padding: 3px 5px;
      margin: 0;
      margin-bottom: 5px;
      outline: none !important;
      border: none;
    }
  }
</style>
