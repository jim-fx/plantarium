<script lang="ts">
  import { setContext } from 'svelte';

  import { writable, type Writable } from 'svelte/store';

  const activeIndex = writable(0);
  setContext('activeIndex', activeIndex);

  let els: Writable<number>[] = [];

  const registerElement = (d: Writable<number>) => {
    d.set(els.length);
    els = [...els, d];
    return () => {
      const index = els.indexOf(d);
      els = els.filter((_, i) => i !== index);
      els.forEach((el, i) => el.set(i));
    };
  };
  setContext('registerElement', registerElement);

  function handleWindowKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      $activeIndex = $activeIndex - 1;
      if ($activeIndex < 0) {
        $activeIndex = els.length - 1;
      }
    } else if (e.key === 'ArrowRight') {
      $activeIndex = ($activeIndex + 1) % els.length;
    }
  }
</script>

<div class="gallery">
  <div class="content">
    <slot />
  </div>
  {#if els.length > 1}
    <div class="button">
      {#each els as _, index}
        <button class:active={$activeIndex === index} on:click={() => ($activeIndex = index)} />
      {/each}
    </div>
  {/if}
</div>

<svelte:window on:keydown={handleWindowKeyDown} />

<style>
  .gallery {
    max-width: 100%;
    max-height: 100%;
  }

  .content {
    position: relative;
    width: min-content;
    width: 100%;
    height: 100%;
  }

  .button {
    position: relative;
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    height: 20px;
  }

  .button > button {
    width: 20px;
    margin: 0px 5px;
    border: none;
    cursor: pointer;
    border-radius: 2px;
    background-color: var(--foreground-color);
  }

  button.active {
    background-color: var(--accent);
  }
</style>
