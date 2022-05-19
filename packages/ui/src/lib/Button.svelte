<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { IconType } from './Icon.svelte';
  import Icon from './Icon.svelte';
  export let icon: IconType | undefined = undefined;
  export let name = '';
  export let active = false;
  export let useActive = false;
  export let invert = false;
  export let disabled = false;

  let buttonEl: HTMLElement;

  $: notWebComponent = buttonEl && !!buttonEl.parentElement;

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    active = !active;
    dispatch('click');
  };
</script>

<div class="component-wrapper">
  <button
    bind:this={buttonEl}
    on:click={handleClick}
    class:active
    class:invert
    class:useActive
    {disabled}
    class:only-icon={!name}
    class:has-icon={!!icon}
  >
    {#if icon}
      {#if notWebComponent}
        <Icon name={icon} {active} --width={'25px'} />
      {:else}
        <plant-icon name={icon} {active} />
      {/if}
    {/if}

    {#if name}
      <p>{name}</p>
    {/if}

    <div class="content">
      <slot />
    </div>
  </button>
</div>

<style lang="scss">
  @use '~@plantarium/theme/src/themes.module.scss';

  button {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 40px;
    height: var(--height, 40px);
    width: var(--width, auto);
    border-radius: 5px;
    border: none;
    background-color: transparent;
    outline: none;
    margin: var(--margin, 0);
    transition: none;
    cursor: pointer;
    color: var(--text-color);
    background-color: var(--foreground-color);
  }

  button.useActive.active {
    background-color: var(--accent);
  }

  button.invert {
    background-color: var(--text-color);
    color: var(--foreground-color);
  }

  button:disabled {
    opacity: 0.8;
    pointer-events: none;
  }

  button.only-icon {
    padding-left: 6px !important;
    width: 40px;
    > :global(.icon-wrapper) {
      left: 9px;
    }
  }

  button.has-icon {
    padding-left: 7px;
  }
  button.has-icon > p {
    padding-left: 10px;
  }

  p {
    font-weight: bolder;
    padding: 0px 5px;
    white-space: var(--white-space, nowrap);
    margin: 0;
  }

  .content {
    position: absolute;
    bottom: 0px;
    left: 0px;
    overflow: visible;
  }
</style>
