<svelte:options accessors />

<script lang="ts">
  import { validator } from '@plantarium/helpers';
  import { scale, slide } from 'svelte/transition';
  import Icon from './Icon.svelte';

  export let validators: ((s: string) => string[] | undefined)[] | boolean;
  $: _validators = getValidators(validators);

  export let placeholder: string | undefined = undefined;
  $: _placeholder = getPlaceholder(placeholder);

  let autocomplete = 'none';

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

  function getValidators(v: typeof validators): ((s: string) => string[] | undefined)[] {
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

  // Export the internal errors
  let errors: string[] = [];

  let _errors: string[] = [];
  let asyncErrors = [];

  const mergeErrors = () => {
    errors = [..._errors, ...asyncErrors].filter((v) => !!v?.length);
    if (!errors.length) {
      value = _value;
    } else {
      value = '';
    }
  };
  let isAsyncRunning = false;
  let errorCheckTimeout: NodeJS.Timeout;
  const getErrors = () => {
    if (!_validators?.length) return [];
    const err = _validators
      .map((v) => v(_value))
      .flat()
      .filter((v) => !!v);

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
        asyncErrors = err;
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
          errorCheckTimeout = undefined;
          _errors = getErrors();
          mergeErrors();
        }, 1000);
      }
    }
  }

  $: _value !== undefined && handleChange();
  let oldValue = _value;
  function handleChange() {
    if (_value === oldValue) return;
    oldValue = _value;
    if (_validators?.length || asyncValidators?.length) checkErrors();
    else value = _value;
  }

  function handleInput(e: Event) {
    _value = e.target.value;
  }
</script>

{#if _placeholder}
  <div class="spacer" />
  <span class="placeholder" class:empty={!_value}>{_placeholder}</span>
{/if}
<div class="component-wrapper" class:has-placeholder={_placeholder}>
  <input
    on:input={handleInput}
    {autocomplete}
    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
  />

  {#if type === 'password' && _value}
    <span class="icon" on:click={() => (showPassword = !showPassword)} transition:scale>
      {#if showPassword}
        <Icon name="eye_closed" />
      {:else}
        <Icon name="eye_open" />
      {/if}
    </span>
  {/if}
</div>

{#if errors?.length}
  <div class="error-wrapper">
    {#each errors as err}
      <p class="error" transition:slide>{err}</p>
    {/each}
  </div>
{/if}

<style lang="scss">
  @import './global.scss';

  .icon {
    position: absolute;
    cursor: pointer;
    right: 10px;
    top: 5px;
    width: 25px;
  }

  .spacer {
    height: 1.7em;
  }

  .placeholder {
    position: absolute;
    pointer-events: none;
    z-index: 22;
    background-color: transparent;
    transform-origin: left center;
    transition: transform 0.1s ease, opacity 0.1s ease;
    opacity: 1;
    transform: translateY(-1.3em) translateX(0px) scale(0.9);
  }

  .error-wrapper {
    background-color: var(--error);
    border-radius: 5px;
    margin-top: 5px;
    padding: 3px 5px;
    overflow: hidden;
  }

  .error-wrapper > p {
    border-bottom: solid white 0.5px;
    padding: 2px 0px;
  }

  .error-wrapper > p:last-child {
    border: none;
    padding-bottom: none;
  }

  .placeholder.empty {
    opacity: 0.5;
    transform: translateY(0.5em) translateX(7px);
  }

  input {
    z-index: -1;
    border: none;
    padding: 5px;
    margin: 2px;
  }

  .component-wrapper {
    overflow: hidden;
    position: relative;
    border-radius: var(--border-radius, 2px);
  }
</style>
