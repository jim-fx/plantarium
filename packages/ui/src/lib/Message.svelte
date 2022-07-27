<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import type { IconType } from './Icon.svelte';
  import { slide } from 'svelte/transition';
  import Button from './Button.svelte';
  import StackTrace from './toast/StackTrace.svelte';
  import { parseStackTrace } from '@plantarium/helpers';

  export let type: 'warning' | 'error' | 'info' | 'success' = 'info';
  export let title: string = undefined;
  export let message: string | string[] | Error;
  export let icon: string | boolean = false;
  export let values: string[] = undefined;
  export let timeout: number = 0;
  export let resolve: (v: string) => void = undefined;

  let animateProgress = false;

  let showStackTrace = false;

  $: iconName = icon && getIcon();

  function getIcon(): IconType {
    if (type === 'error') {
      return 'warning';
    }
    if (type === 'success') {
      return 'checkmark';
    }
    if (type === 'warning') {
      return 'exclamation';
    }
    return;
  }

  $: isInverted = type === 'success' || type === 'warning' || type === 'error';

  onMount(() => {
    console.log({ message });
    setTimeout(() => {
      animateProgress = true;
    }, 10);
  });
</script>

<div class="wrapper">
  <div class="toast toast-{type}" class:isInverted>
    <div class="toast-content" class:hasIcon={!!icon}>
      {#if iconName}
        <div class="toast-icon">
          <Icon name={iconName} dark={isInverted} animateIn circle --width="40px" --height="40px" />
        </div>
      {/if}

      <div class="toast-text">
        {#if title}
          <h3>{title}</h3>
        {/if}

        {#if typeof message === 'string'}
          <p>{@html message}</p>
        {:else if Array.isArray(message)}
          <div class="error-wrapper">
            {#each message as err}
              <p class="error" transition:slide>{err}</p>
            {/each}
          </div>
        {:else if message instanceof Error}
          <p>
            {message.message}
          </p>
          {#if showStackTrace}
            <div class="stack-trace" transition:slide>
              <StackTrace stacktrace={parseStackTrace(message)} />
            </div>
          {/if}
        {/if}

        <div class="button-wrapper">
          {#if message instanceof Error}
            <Button
              --margin="5px 10px 5px 0px"
              invert={isInverted}
              --bg="transparent"
              on:click={() => {
                showStackTrace = !showStackTrace;
              }}
              name="> StackTrace"
            />
          {/if}

          {#if values}
            {#each values as v}
              <div class="button-spacer">
                <Button
                  --height="fit-content"
                  --white-space="break-spaces"
                  --margin="5px 10px 5px 0"
                  on:click={() => resolve(v)}
                  name={v}
                />
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>

    <div
      class:animateProgress
      style={`transition: width ${timeout}ms linear;`}
      class="toast-progress"
    />
  </div>
</div>

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
    width: min-content;
    min-width: max-content;
  }

  .isInverted {
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
      grid-template-columns: auto;

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
          margin: 0;
          white-space: pre-line;
        }
      }
    }

    .error-wrapper {
      border-radius: 0px 0px 5px 5px;
      box-sizing: border-box;
      padding: 3px 5px;
      overflow: hidden;

      min-width: 100%;
    }

    .error-wrapper > p {
      border-bottom: solid white 0.5px;
      margin: 0;
      padding: 2px 0px;
    }

    .error-wrapper > p:last-child {
      border: none;
      padding-bottom: none;
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
    background-color: var(--midground-color, #303030);

    color: var(--text-color, white);
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
    background-color: var(--error, #e26565);
    color: white;

    .toast-progress {
      background-color: white;
    }
  }
</style>
