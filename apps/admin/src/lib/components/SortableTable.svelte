<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { getId } from '$lib/helpers/getId';
  import { InputCheckbox } from '@plantarium/ui';

  export let items: unknown[] = [];

  export let keys: string[] = undefined;
  export let component: SvelteComponent = undefined;
  export let componentKey = 'item';
  export let defaultKey: string | null = null;
  export let useLink = false;

  $: _keys =
    keys && keys.length ? keys : items.length ? Object.keys(items[0]) : [];

  $: activeKey = _keys.length && _keys[0];

  if (defaultKey && _keys?.length && _keys.includes(defaultKey)) {
    activeKey = defaultKey;
  }

  let reverseSort = false;

  function sortItems(reverse: boolean) {
    const _sort = items.sort((a, b) => {
      return a[activeKey] > b[activeKey] ? -1 : 1;
    });

    if (reverse) return _sort.reverse();
    return _sort;
  }

  $: sortedItems = items.length && activeKey ? sortItems(reverseSort) : [];

  function handleClick(key: string) {
    if (key === activeKey) {
      reverseSort = !reverseSort;
    } else {
      activeKey = key;
    }
  }
</script>

{#if _keys.length}
  <table>
    <thead class="rounded shadow-md cursor-pointer select-none">
      {#each _keys as key}
        <td
          class="p-2 whitespace-nowrap"
          on:click={() => handleClick(key)}
          class:font-bold={key === activeKey}
        >
          <span class="text-xs"
            >{key === activeKey ? (reverseSort ? '▲' : '▼') : '  '}</span
          >
          {key}
        </td>
      {/each}
    </thead>

    <tbody>
      {#each sortedItems as item (getId(item))}
        <tr
          class="my-5"
          on:click={() => useLink && goto($page.url + '/' + getId(item))}
        >
          {#if component}
            <td colspan={component ? _keys.length : 1} class="py-1">
              <svelte:component
                this={component}
                {...{ [componentKey]: item }}
              />
            </td>
          {:else}
            {#each _keys as key}
              <td>
                {#if typeof item[key] === 'boolean'}
                  <InputCheckbox value={item[key]} disabled />
                {:else if ['number', 'boolean', 'string'].includes(typeof item[key])}
                  {#if item[key].toString().length > 100}
                    {item[key].toString().slice(0, 50)}
                  {:else}
                    {item[key]}
                  {/if}
                {:else}
                  {JSON.stringify(item[key]).slice(0, 100)}
                {/if}
              </td>
            {/each}
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>This table seems empty</p>
{/if}

<style>
  thead {
    background-color: var(--foreground-color);
  }
</style>
