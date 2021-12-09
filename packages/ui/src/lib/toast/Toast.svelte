<script lang="ts">
  import { parseStackTrace } from '@plantarium/helpers';
  import { onMount, SvelteComponent } from 'svelte';
  import { slide } from 'svelte/transition';
  import Button from '../Button.svelte';
  import type { Message } from '../helpers/IMessage';
  import { MessageType } from '../helpers/IMessage';
  import type { IconType } from '../Icon.svelte';
  import Icon from '../Icon.svelte';
  import StackTrace from './StackTrace.svelte';

  export let toast: Message;

  let animateProgress = false;

  let showStackTrace = false;

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
            <Icon name={icon} circle --width="40px" --height="40px" />
          </div>
        {/if}

        <div class="toast-text">
          {#if toast.title}
            <h3>{toast.title}</h3>
          {/if}

          {#if typeof toast.content === 'string'}
            <p>{@html toast.content}</p>
          {:else if toast.content instanceof Error}
            <p>
              {toast.content.message}
            </p>
            {#if showStackTrace}
              <div class="stack-trace" transition:slide>
                <StackTrace stacktrace={parseStackTrace(toast.content.stack)} />
              </div>
            {/if}
          {:else if toast.content instanceof SvelteComponent}
            <svelte:component this={toast.content} />
          {/if}

          <div class="button-wrapper">
            {#if toast.content instanceof Error}
              <Button
                --margin="5px 10px 5px -10px"
                --text={isInverted ? '#1a1a1a' : 'white'}
                --bg="transparent"
                on:click={() => {
                  showStackTrace = !showStackTrace;
                }}
                name="> StackTrace"
              />
            {/if}

            {#if toast.values}
              {#each toast.values as v}
                <div class="button-spacer">
                  {#if isCustomElement}
                    <plant-button on:click={() => toast.resolve(v)} name={v} />
                  {:else}
                    <Button
                      --margin="5px 10px 5px 0"
                      --text={isInverted ? 'white' : '#1a1a1a'}
                      --bg={isInverted ? '#1a1a1a' : 'white'}
                      on:click={() => toast.resolve(v)}
                      name={v}
                    />
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
        <div class="toast-close" on:click={() => toast.reject()}>
          <Icon name="cross" --height="fit-content" />
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
  .stack-trace {
    margin: 0 !important;
    max-width: 100%;
  }
  .wrapper {
    padding: 10px;
  }

  .button-spacer {
    display: inline-block;
  }

  .button-wrapper {
    display: flex;
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
      }

      > .toast-text {
        max-width: max(30vw, 200px);
        h3 {
          margin: 0;
          margin-bottom: 5px;
        }
        p {
          white-space: pre-line;
          margin-bottom: 5px;
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
