<svelte:options tag="plant-button" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { IconType } from './Icon.svelte';
  import Icon from './Icon.svelte';
  export let icon: IconType | undefined = undefined;
  export let name = '';
  export let active = false;
  export let useActive = false;
  export let disabled = false;

	let buttonEl: HTMLElement;

	$: notWebComponent =buttonEl && !!buttonEl.parentElement;

	const dispatch = createEventDispatcher();

  const handleClick = () => {
    active = !active;
    dispatch('click');
  };
</script>

<button
	bind:this={buttonEl}
  on:click={handleClick}
  class:active
  class:useActive
  {disabled}
  class:only-icon={!name}
  class:has-icon={!!icon}
>
  {#if icon}
		{#if notWebComponent}
			<Icon name={icon} {active} />
		{:else}
			<plant-icon name={icon} {active}/>
		{/if}
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

  button.active.useActive {
    background-color: #65e2a0 !important;
    > p {
      color: #303030 !important;
    }
    > :global(.icon-wrapper > svg > *) {
      stroke: #303030 !important;
    }
  }

  button {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    border-radius: 5px;
    border: none;
    background-color: transparent;
    outline: none;
    margin: var(--margin, 0);
    transition: none;
    cursor: pointer;
    background-color: var(--bg, --foreground-color);
  }

  button:disabled {
    opacity: 0.8;
    pointer-events: none;
  }

  button.only-icon {
    width: 40px;
    > :global(.icon-wrapper) {
      left: 9px;
    }
  }

  button.has-icon { 
		> :global(.icon-wrapper),plant-icon {
			position: absolute;
			top: 9px;
			height: calc(100% - 18px);
		}
	}

  button.has-icon > p {
    padding-left: 30px;
  }

  p {
    color: var(--text-color);
    font-weight: bolder;
    padding: 0px 5px;
    white-space: nowrap;
    margin: 0;
  }

  .content {
    position: absolute;
    bottom: 0px;
    left: 0px;
    overflow: visible;
  }
</style>
