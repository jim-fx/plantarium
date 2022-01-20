<svelte:options tag="plant-alert-wrapper" />

<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import Button from '../Button.svelte';
  import { store } from './AlertStore';

  $: alert = $store[0];

  $: isInverted = alert && (alert.type === 'success' || alert.type === 'warning');

  function handleKeyDown(ev) {
    if (ev.key === 'Escape') {
      alert.reject();
    }
  }
</script>

{#if alert}
  <div class="alert-container" transition:fade>
    <div class="alert-wrapper alert-{alert.type}" transition:scale class:isInverted>
      {#if alert.title}
        <h2>{alert.title}</h2>
      {/if}

      {#if typeof alert.content === 'string'}
        <p>{@html alert.content}</p>
      {:else}
        <svelte:component this={alert.content} {...alert.props} />
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
    background-color: rgba(0, 0, 0, 0.493);
    display: grid;
    place-items: center;
    backdrop-filter: blur(5px) contrast(0.5);
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
  }

  .options-wrapper {
    padding-top: 20px;
  }

  .alert-info {
    background-color: #303030;

    color: white;
    .alert-progress {
      background-color: white;
    }
  }

  .alert-success {
    background-color: #65e2a0;
    color: black;
    border-color: gray;

    .alert-progress {
      background-color: gray;
    }
  }

  .alert-warning {
    background-color: #fffd7b;
  }

  .alert-error {
    background-color: #e26565;
    color: white;

    .alert-progress {
      background-color: white;
    }
  }
</style>
