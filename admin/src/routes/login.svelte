<script lang="ts">
  import api from '@plantarium/client-api';
  import { createToast, Form } from '@plantarium/ui';
  import ApiCall from '$lib/components/ApiCall.svelte';
  import { goto } from '$app/navigation';

  let prom: Promise<any>;

  const formField = {
    username: { label: 'Username/Email', placeholder: 'Username/Email' },
    password: { type: 'password' },
    submit: { type: 'submit', label: 'login' },
  };

  async function handleSubmit(ev) {
    const { username, password } = ev.data;

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
    <Form title="Login" fields={formField} on:submit={handleSubmit} />
  {/if}
</div>
