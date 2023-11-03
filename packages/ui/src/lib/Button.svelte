<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { IconType } from './Icon.svelte';
  import Icon from './Icon.svelte';
  export let icon: IconType | undefined = undefined;
  export let active = false;
  export let useActive = false;
  export let invert = false;
  export let disabled = false;

  let buttonEl: HTMLElement;

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    active = !active;
    dispatch('click');
  };
</script>

<button
  bind:this={buttonEl}
  on:click={handleClick}
  on:mousedown={() => dispatch('mousedown')}
  class:active
  class:invert
  class:useActive
  {disabled}
>
  {#if icon}
    <Icon name={icon} {active} dark={invert} --width="1.4em" />
  {/if}

  <slot />
</button>

<style lang="scss">
  button {
    position: relative;
    display: flex;
    align-items: center;
    min-height: var(--min-height, auto);
    font-family: var(--font-family);
    height: var(--height, auto);
    width: var(--width, auto);
    font-size: 1em;
    border-radius: 5px;
    border: none;
    background-color: transparent;
    outline: none;
    margin: var(--margin, 0);
    padding: 6px;
    padding-inline: 10px;
    transition: none;
    cursor: pointer;
    color: var(--text-color);
    background-color: var(--foreground-color);
    white-space: var(--white-space, nowrap);
    display: flex;
    gap: 6px;
  }

  button.useActive.active {
    background-color: var(--accent);
  }

  button.invert {
    background-color: var(--text-color);
    color: var(--background-color);
  }

  button:disabled {
    opacity: 0.8;
    pointer-events: none;
  }
</style>
