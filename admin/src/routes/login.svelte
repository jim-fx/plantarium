<script lang="ts">
  import api, { userStore } from '@plantarium/client-api';
  import { validator } from '@plantarium/helpers';
  import { slide } from 'svelte/transition';
  import {
    Button,
    InputText,
    InputCheckbox,
    createToast,
  } from '@plantarium/ui';
  import Icon from '@plantarium/ui/src/lib/Icon.svelte';
  import ApiCall from '$lib/components/ApiCall.svelte';
  import { goto } from '$app/navigation';

  let username: string;
  let password: string;

  let prom: Promise<any>;

  async function handleSubmit() {
    if (!username || !password) return;
    if (prom) return;

    prom = api.login(username, password);
  }
</script>

<div class="wrapper mx-auto w-min p-8">
  {#if prom}
    <ApiCall
      bind:promise={prom}
      path=""
      on:success={() => {
        goto('/');
        createToast('Logged In', { type: 'success' });
      }}
    />
  {:else}
    <h3>Login</h3>

    <InputText bind:value={username} placeholder="Username" />

    <InputText bind:value={password} validators={false} type="password" />

    <br />
    <Button
      name={'login'}
      on:click={handleSubmit}
      disabled={!(username && password)}
    />
  {/if}
</div>
