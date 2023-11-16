<script lang="ts">
  import { isBrowser } from '../helpers/isBrowser';

  import { fade, scale } from 'svelte/transition';
  import Button from '../Button.svelte';
  import { store } from './AlertStore';
  import type { Message } from '$lib/helpers/IMessage';

  $: if ($store?.length) {
    isBrowser && document.body.classList.add('overlay-visible');
  } else {
    isBrowser && document.body.classList.remove('overlay-visible');
  }

  function getStyle(a: Message) {
    return a?.styleVars
      ? Object.entries(a.styleVars)
          .map(([key, value]) => `--${key}: ${value};`)
          .join('')
      : '';
  }

  function handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape' && $store?.length) {
      $store[$store.length - 1].reject?.();
    }
  }
</script>

{#if $store?.length}
  {#each $store as alert, i}
    <div class="alert-container" transition:fade style={`${getStyle(alert)} z-index:${99 + i}`}>
      <div
        class="alert-wrapper alert-{alert.type}"
        transition:scale
        class:isInverted={alert.type === 'success' || alert.type === 'warning'}
      >
        <div class="close-wrapper">
          <Button
            icon="cross"
            --foreground-color="transparent"
            on:click={() => {
              alert.reject?.();
            }}
          />
        </div>

        {#if alert.title}
          <h2>{alert.title}</h2>
        {/if}

        {#if typeof alert.content === 'string'}
          <p>{@html alert.content}</p>
        {:else}
          <svelte:component
            this={alert.content}
            {...alert.props}
            on:close={() => alert.resolve?.(false)}
          />
        {/if}

        {#if alert.values}
          <div class="options-wrapper">
            {#each alert.values as value}
              <Button
                --bg={'#303030'}
                --text={'white'}
                --margin="0 10px 0 0"
                on:click={() => alert.resolve?.(value)}
              >
                {value}
              </Button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/each}
{/if}

<svelte:window on:keydown={handleKeyDown} />

<style lang="scss">
  .alert-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    backdrop-filter: blur(5px) contrast(0.5);
    background-color: rgba(0, 0, 0, 0.7);
  }

  .close-wrapper {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  h2 {
    margin-bottom: 30px;
  }

  .alert-wrapper {
    position: relative;
    box-sizing: border-box;
    min-width: 200px;

    max-height: 80vh;
    max-width: 80vw;

    font-size: 1.3em;

    white-space: pre-line;

    padding: var(--padding, 25px);

    border-radius: 30px;
    outline: solid thin var(--outline-color);

    backdrop-filter: blur(10px) contrast(0.5) brightness(1.5);
    overflow-y: auto;

    background-color: var(--background-color);
  }

  .options-wrapper {
    padding-top: 20px;
    display: flex;
  }
</style>
