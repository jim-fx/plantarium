<script lang="ts">
  import api from '@plantarium/client-api';
  import { createToast, Form } from '@plantarium/ui';
  import ApiCall from '$lib/components/ApiCall.svelte';

  let prom: ReturnType<(typeof api)['login']>;

  const formField = {
    username: { label: 'Username/Email', placeholder: 'Username/Email' },
    password: { type: 'password' },
    submit: { type: 'submit', label: 'login' },
  };

  async function handleSubmit(ev: {
    detail: { username: string; password: string };
  }) {
    const { username, password } = ev.detail;

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
        createToast('Logged In', { type: 'success' });
      }}
    />
  {:else}
    <Form
      --width="300px"
      title="Login"
      fields={formField}
      on:submit={handleSubmit}
    />
  {/if}
</div>
