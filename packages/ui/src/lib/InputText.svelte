<svelte:options accessors />

<script lang="ts">
  import { validator } from '@plantarium/helpers';
  import { scale, slide } from 'svelte/transition';
  import Icon from './Icon.svelte';

  export let validators: ((s: string) => string[] | boolean | undefined)[] | boolean = [];
  $: _validators = getValidators(validators);

  export let placeholder: string | undefined = undefined;
  $: _placeholder = getPlaceholder(placeholder);

  export let autocomplete = 'none';

  export let type: 'email' | 'username' | 'password' | string = 'text';

  function getPlaceholder(v?: string) {
    if (v) return v;
    autocomplete = 'none';
    if (type === 'password') {
      autocomplete = 'password';
      return 'Password';
    } else if (type === 'email') {
      autocomplete = 'email';
      return 'Email';
    }
  }

  function getValidators(v: typeof validators): ((s: string) => string[] | boolean | undefined)[] {
    _errors = [];
    asyncErrors = [];
    mergeErrors();

    if (v === false) return [];

    if (type === 'password') {
      if (!Array.isArray(v)) return validator.password;
    } else if (type === 'email') {
      if (!Array.isArray(v)) return validator.email;
    }

    if (v === true) return [];

    return v;
  }

  export let asyncValidators: ((s: string) => Promise<string[]>)[] = [];

  export let value: string;
  let _value: string;

  let showPassword = false;

  let focused = false;

  // Export the internal errors
  export let errors: string[] = [];

  let _errors: string[] = [];
  let asyncErrors: string[] = [];

  const mergeErrors = () => {
    errors = [..._errors, ...asyncErrors].filter((v) => !!v?.length);
    if (!errors.length) {
      value = _value;
    } else {
      value = '';
    }
  };
  let isAsyncRunning = false;
  let errorCheckTimeout: number | null;
  const getErrors = () => {
    if (!_validators?.length) return [];
    const err = _validators
      .map((v) => v(_value))
      .flat()
      .filter((v) => !!v) as string[];

    return err.slice(0, 2);
  };
  function checkErrors() {
    if (!_value?.length) {
      _errors = [];
      asyncErrors = [];
      return;
    }

    const newErrors = getErrors();

    if (!isAsyncRunning && asyncValidators?.length) {
      isAsyncRunning = true;
      Promise.all(asyncValidators.map((v) => v(_value))).then((err) => {
        asyncErrors = err.flat();
        isAsyncRunning = false;
        mergeErrors();
      });
    }

    // If any errors have been cleared
    // show it immediately
    if (newErrors.length <= _errors.length) {
      _errors = newErrors;
      mergeErrors();
      return;
    } else {
      if (!errorCheckTimeout) {
        errorCheckTimeout = setTimeout(() => {
          errorCheckTimeout = null;
          _errors = getErrors();
          mergeErrors();
        }, 1000) as unknown as number;
      }
    }
  }

  $: _value !== undefined && handleChange();
  let oldValue: string;

  function handleChange() {
    if (_value === oldValue) return;
    oldValue = _value;
    if (_validators?.length || asyncValidators?.length) checkErrors();
    else value = _value;
  }

  function handleInput(e: Event) {
    _value = (e?.target as HTMLInputElement)?.value;
  }
</script>

<div
  class="component-wrapper"
  class:has-placeholder={_placeholder}
  class:has-errors={errors?.length}
>
  {#if _placeholder}
    <span class="placeholder" class:empty={!_value && !focused}>{_placeholder}</span>
  {/if}

  {#if type === 'area'}
    <textarea
      on:input={handleInput}
      on:focus={() => (focused = true)}
      on:blur={() => (focused = false)}
    />
  {:else}
    <input
      on:input={handleInput}
      on:focus={() => (focused = true)}
      on:blur={() => (focused = false)}
      {autocomplete}
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
    />
  {/if}

  {#if type === 'password' && _value}
    <span
      class="icon"
      on:keydown={() => (showPassword = !showPassword)}
      on:click={() => (showPassword = !showPassword)}
      transition:scale
      role="button"
      tabindex="0"
    >
      {#if showPassword}
        <Icon --width="100%" name="eye_closed" />
      {:else}
        <Icon --width="100%" name="eye_open" />
      {/if}
    </span>
  {/if}

  {#if errors?.length}
    <div class="error-wrapper">
      {#each errors as err}
        <p class="error" transition:slide>{err}</p>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @import './global.scss';

  .icon {
    position: absolute;
    cursor: pointer;
    right: 10px;
    top: 0.45em;
    width: 25px;
  }

  .placeholder {
    position: absolute;
    pointer-events: none;
    z-index: 22;
    background-color: transparent;
    transform-origin: left center;
    transition: transform 0.1s ease, opacity 0.1s ease;
    opacity: 0.6;
    transform: translateY(-1.5em) translateX(0px) scale(0.75);
  }

  .error-wrapper {
    background-color: var(--error);
    border-radius: 0px 0px 5px 5px;
    box-sizing: border-box;
    padding: 3px 5px;
    overflow: hidden;

    width: min-content;
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

  .placeholder.empty {
    opacity: 0.5;
    transform: translateY(0.4em) translateX(10px);
  }

  .has-errors.component-wrapper {
    border-radius: var(--border-radius, 5px) var(--border-radius, 5px) 0px 0px;
  }

  input,
  textarea {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    border: none;
    font-size: 1.1em;
    border-radius: 5px;
    background-color: var(--foreground-color);
    color: var(--text-color);
    padding: var(--padding, 8px);
  }

  .component-wrapper {
    position: relative;
    width: auto;
    border-radius: var(--border-radius, 5px);
  }
</style>
