<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  export let items: unknown[] = [];

  export let keys: string[] = undefined;
  export let component: SvelteComponent = undefined;
  export let componentKey = 'item';
  export let useLink = false;

  $: _keys =
    keys && keys.length ? keys : items.length ? Object.keys(items[0]) : [];

  $: activeKey = _keys.length && _keys[0];

  let reverseSort = false;

  function sortItems(reverse: boolean) {
    const _sort = items.sort((a, b) => {
      return a[activeKey] > b[activeKey] ? -1 : 1;
    });

    if (reverse) return _sort.reverse();
    return _sort;
  }

  $: sortedItems = items.length && activeKey ? sortItems(reverseSort) : [];

  function getKey(item: any) {
    if ('id' in item) return item['id'];
    if ('_id' in item) return item['_id'];
    return '';
  }

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
            >{key === activeKey ? (reverseSort ? '⮝' : '⮟') : '  '}</span
          >
          {key}
        </td>
      {/each}
    </thead>

    <tbody>
      {#each sortedItems as item (getKey(item))}
        <tr
          class="my-5"
          on:click={() => useLink && goto($page.url + '/' + getKey(item))}
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
                {item[key]}
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
