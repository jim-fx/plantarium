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
      <Button
        --margin="0px 0px 0px 0px"
        --width="fit-content"
        disabled={Object.values(errors).flat().length > 0 || Object.keys(data).length < 0}
      >
        {field.label || 'submit'}
      </Button>
    {:else if field.type === 'checkbox'}
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
  h3 {
    margin: 0;
  }
  form {
    border-radius: var(--border-radius, 10px);
    background-color: var(--background, var(--midground-color));
    width: var(--width, fit-content);
    min-width: var(--min-width, auto);
    padding: 20px 20px;
    display: flex;
    gap: 30px;
    flex-direction: column;
  }
</style>
