<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Button from './Button.svelte';
  import ButtonGroup from './ButtonGroup.svelte';

  export let value: string | null;
  let initialValue = value;
  let el: HTMLHeadingElement;

  let isFocused = false;

  const dispatch = createEventDispatcher();

  function tryToPreventNewLines(e: KeyboardEvent | Event) {
    if ('key' in e) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          submit();
          return false;
        case 'Escape':
          e.preventDefault();
          clear();
          return false;
      }
    }

    const { textContent: newValue } = el;

    if (value !== newValue) {
      value = newValue;
    }
  }

  function submit() {
    value = el.textContent;
    dispatch('submit', value);
    el.contentEditable = 'false'; // No longer editable
    el.blur(); // Remove selection box on Firefox
  }

  function clear() {
    value = initialValue;
    el.contentEditable = 'false';
    el.blur();
    el.textContent = initialValue;
  }

  function enableEdit() {
    initialValue = value;
    el.contentEditable = 'true'; // Make it editable
    el.focus(); // And put the cursor in it
  }
</script>

<div class:isFocused>
  <ButtonGroup direction="horizontal">
    {#if isFocused}
      <Button
        icon="cross"
        on:mousedown={() => {
          clear();
        }}
      />
      <Button
        icon="checkmark"
        on:mousedown={() => {
          submit();
        }}
      />
    {:else}
      <Button icon="edit" on:click={enableEdit} />
    {/if}
  </ButtonGroup>
  <h2
    bind:this={el}
    on:click={enableEdit}
    on:change={tryToPreventNewLines}
    on:keydown={tryToPreventNewLines}
    on:keyup={tryToPreventNewLines}
    on:focus={() => (isFocused = true)}
    on:blur={() => {
      isFocused = false;
    }}
  >
    {value}
  </h2>
</div>

<style>
  h2 {
    display: inline;
    margin: 0;
    margin-left: 10px;
    margin-right: 10px;
    outline: none !important;
  }
  div {
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 2px;
    border-radius: 5px;
    outline: solid thin transparent;
    transition: outline 0.3s ease;
  }

  div.isFocused {
    outline: solid thin var(--foreground-color);
  }
</style>
