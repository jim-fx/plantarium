<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import InputCheckbox from './InputCheckbox.svelte';
  import InputText from './InputText.svelte';

  interface Field {
    type?: 'email' | 'password' | 'username' | 'submit' | string;
    label?: string;
    autocomplete?: boolean;
    placeholder?: string;
    validators?: ((s: string) => string[] | boolean | undefined)[];
    asyncValidators?: ((s: string) => Promise<string[] | boolean | undefined>)[];
  }

  export let fields: Record<string, Field> = {};

  export const data: Record<string, boolean & string> = {};
  $: dispatch('data', data);
  const errors: Record<string, string[]> = {};

  export let title: string;

  const dispatch = createEventDispatcher();

  function handleSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    ev.stopImmediatePropagation();

    if (Object.values(errors).flat().length) return;

    dispatch('submit', data);
  }
</script>

<form on:submit={handleSubmit}>
  {#if title?.length}
    <h3>{title}</h3>
  {/if}
  {#each Object.entries(fields) as [key, field] (key)}
    {#if field.type === 'submit'}
      <div class="spacer" />
      <Button
        name={field.label || 'submit'}
        disabled={Object.values(errors).flat().length > 0 || Object.keys(data).length < 0}
      />
    {:else if field.type === 'checkbox'}
      <br />
      <InputCheckbox label={field.label} bind:value={data[key]} />
    {:else}
      <InputText
        type={field.type}
        autocomplete={field?.autocomplete ? field.type || 'none' : 'none'}
        placeholder={field.placeholder}
        validators={field.validators}
        bind:errors={errors[key]}
        bind:value={data[key]}
      />
    {/if}
  {/each}
</form>

<style>
  .spacer {
    height: 1.5em;
  }
  h3 {
    margin: 0;
  }
  form {
    border-radius: 10px;
    background-color: var(--background, var(--midground-color));
    width: fit-content;
    padding: 20px 20px;
  }
</style>
