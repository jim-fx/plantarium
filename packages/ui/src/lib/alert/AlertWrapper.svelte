<script lang="ts">
  import { isBrowser } from '../helpers/isBrowser';

  import { fade, scale } from 'svelte/transition';
  import Button from '../Button.svelte';
  import { store } from './AlertStore';

  $: alert = $store[0];

  $: if (alert) {
    isBrowser && document.body.classList.add('overlay-visible');
  } else {
    isBrowser && document.body.classList.remove('overlay-visible');
  }

  $: isInverted = alert && (alert.type === 'success' || alert.type === 'warning');

  function handleKeyDown(ev) {
    if (ev.key === 'Escape' && alert) {
      alert.reject();
    }
  }
</script>

{#if alert}
  <div class="alert-container" transition:fade>
    <div class="alert-wrapper alert-{alert.type}" transition:scale class:isInverted>
      <div class="close-wrapper">
        <Button
          icon="cross"
          --bg="transparent"
          on:click={() => {
            alert.reject();
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
          on:close={() => alert.resolve(false)}
        />
      {/if}

      {#if alert.values}
        <div class="options-wrapper">
          {#each alert.values as value}
            <Button
              --bg={'#303030'}
              --text={'white'}
              on:click={() => alert.resolve(value)}
              name={value}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<svelte:window on:keydown={handleKeyDown} />

<style lang="scss">
  .alert-container {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    backdrop-filter: blur(5px) contrast(0.5);
    background-color: rgba(0, 0, 0, 0.493);
  }

  .close-wrapper {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  h2 {
    margin-bottom: 10px;
  }

  .alert-wrapper {
    min-width: 200px;

    max-height: 80vh;
    max-width: 60vw;

    font-size: 1.3em;

    white-space: pre-line;

    padding: 25px;

    border-radius: 30px;

    backdrop-filter: blur(10px) contrast(0.5) brightness(1.5);
    overflow-y: auto;

    background-color: #3b3b3b;
  }

  .options-wrapper {
    padding-top: 20px;
    display: flex;
  }
</style>
