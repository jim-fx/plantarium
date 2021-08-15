<svelte:options tag="plant-toast" />

<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '../Icon.svelte';
  import Button from '../Button.svelte';
  import type { IconType } from '../Icon.svelte';
  import type { Message } from '../helpers/IMessage';
  import { MessageType } from '../helpers/IMessage';
  export let toast: Message;

  $: console.log(toast);

  let animateProgress = false;

  $: icon = toast && getIcon();

  function getIcon(): IconType | undefined {
    if (toast.type === MessageType.ERROR) {
      return 'warning';
    }
    if (toast.type === MessageType.SUCCESS) {
      return 'checkmark';
    }
    if (toast.type === MessageType.WARNING) {
      return 'exclamation';
    }
    return;
  }

  $: isInverted =
    toast && (toast.type === 'success' || toast.type === 'warning');

  let isCustomElement = false;
  let el: HTMLElement;
  $: isCustomElement = el && !el.parentElement;
  onMount(() => {
    setTimeout(() => {
      animateProgress = true;
    }, 10);
  });
</script>

{#if toast}
  <div class="wrapper" bind:this={el}>
    <div class="toast toast-{toast.type}" class:isInverted>
      <div class="toast-content" class:hasIcon={!!icon}>
        {#if icon}
          <div class="toast-icon">
            <Icon name={icon} circle />
          </div>
        {/if}

        <div class="toast-text">
          <h3>{toast.title}</h3>
          <p>{toast.content}</p>

          {#if toast.values}
            {#each toast.values as v}
              <div class="button-spacer">
                {#if isCustomElement}
                  <plant-button on:click={() => toast.resolve(v)} name={v} />
                {:else}
                  <Button on:click={() => toast.resolve(v)} name={v} />
                {/if}
              </div>
            {/each}
          {/if}
        </div>
        <div class="toast-close" on:click={() => toast.reject()}>
          <Icon name="cross" />
        </div>
      </div>

      <div
        class:animateProgress
        style={`transition: width ${toast.timeout}ms linear;`}
        class="toast-progress"
      />
    </div>
  </div>
{/if}

<style lang="scss">
  .wrapper {
    padding: 10px;
  }

  .button-spacer {
    display: inline-block;
  }

  .isInverted {
    .toast-close,
    .toast-icon {
      filter: invert(0.8);
    }

    p,
    h3 {
      color: #303030;
    }

    .toast-progress {
      background-color: #303030 !important;
    }
  }

  .toast {
    position: relative;

    width: fit-content;
    padding: 10px;
    border-radius: 5px;

    overflow: hidden;

    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.7);

    > .toast-content {
      display: grid;
      column-gap: 15px;
      grid-template-columns: auto 28px;

      &.hasIcon {
        grid-template-columns: 40px auto 28px;
      }

      > .toast-icon {
        width: 100%;
        border: solid medium var(--text-color);
      }

      > .toast-text {
        max-width: max(30vw, 200px);
        h3 {
          margin: 0;
        }
        p {
          line-break: anywhere;
        }
      }

      > .toast-close {
        width: 30px;
        cursor: pointer;
      }
    }

    .toast-progress {
      background-color: white;
      position: absolute;
      height: 5px;
      width: 100%;
      left: 0;
      bottom: 0;
      opacity: 0.5 !important;
    }

    .animateProgress {
      width: 0%;
    }
  }

  .toast-info {
    background-color: #303030;

    color: white;
    .toast-progress {
      background-color: white;
    }
  }

  .toast-success {
    background-color: #65e2a0;
    color: black;
    border-color: gray;

    .toast-progress {
      background-color: gray;
    }
  }

  .toast-warning {
    background-color: #fffd7b;
  }

  .toast-error {
    background-color: #e26565;
    color: white;

    .toast-progress {
      background-color: white;
    }
  }
</style>
