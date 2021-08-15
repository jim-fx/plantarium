<svelte:options tag="plant-button" />

<script lang="ts">
  import Icon from './Icon.svelte';
  import type { IconType } from './Icon.svelte';
  import { createEventDispatcher } from 'svelte';
  export let icon: IconType | undefined = undefined;
  export let name = '';
  export let cls = '';
  export let active = false;

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    active = !active;
    dispatch('click');
  };
</script>

<button
  on:click={handleClick}
  class={cls}
  class:active
  class:only-icon={!name}
  class:has-icon={!!icon}
>
  {#if icon}
    <Icon name={icon} {active} />
  {/if}

  {#if name}
    <p>{name}</p>
  {/if}

  <div class="content">
    <slot />
  </div>
</button>

<style lang="scss">
  @import './global.scss';

  button {
    position: relative;
    height: 40px;
    border-radius: 5px;
    border: none;
    background-color: transparent;
    outline: none;
    transition: none;
    cursor: pointer;
    background-color: var(--background-color, #303030);
  }

  button.only-icon {
    width: 40px;
    > :global(.icon-wrapper) {
      left: 9px;
    }
  }

  button.has-icon > :global(.icon-wrapper) {
    position: absolute;
    top: 9px;
    height: calc(100% - 18px);
  }

  button.has-icon > p {
    padding-left: 30px;
  }

  p {
    color: var(--text-color, white);
    font-weight: bolder;
    padding: 0px 5px;
    margin: 0;
  }

  .content {
    position: absolute;
    bottom: 0px;
    left: 0px;
    overflow: visible;
  }
</style>
