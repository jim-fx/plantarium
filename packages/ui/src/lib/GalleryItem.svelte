<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';

  const register = getContext<(d: Writable<number>) => () => void>('registerElement');
  const activeIndex = getContext<Writable<number>>('activeIndex');
  const index = writable(0);
  let unregister: ReturnType<typeof register>;

  $: visible = $activeIndex === $index;

  onDestroy(() => unregister?.());
  onMount(() => (unregister = register(index)));
</script>

<div class:visible>
  <slot />
</div>

<style>
  div {
    position: absolute;
    display: grid;
    place-items: center;
    opacity: 0;
    pointer-events: none;
  }

  div.visible {
    opacity: 1;
    position: relative;
    pointer-events: all;
  }
</style>
