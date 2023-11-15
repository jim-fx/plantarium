<script lang="ts">
	import * as api from '@plantarium/client-api';
	import { validator } from '@plantarium/helpers';
	import { Button, createToast, Form } from '@plantarium/ui';

	import { Icon } from '@plantarium/ui';

	let register = false;

	const userStore = api.userStore;

	async function checkUsernameExists(s: string) {
		const res = await api.getUserNameExists(s);
		if (res.ok && res.data) {
			return ['Username ' + s + ' is already registered'];
		}
		return [];
	}

	async function checkEmailExists(s: string) {
		const res = await api.getEmailExists(s);
		if (res.ok && res.data) {
			return ['Email ' + s + ' is already registered'];
		}
		return [];
	}

	let errors: string[] = [];

	let isLoading = false;

	let formData = {} as any;

	$: register = !!formData?.register;

	$: formFields = register
		? {
				username: {
					type: 'username',
					placeholder: 'Username',
					validators: validator.username,
					asyncValidators: [checkUsernameExists]
				},
				email: { type: 'email', validators: validator.email, asyncValidators: [checkEmailExists] },
				password: { type: 'password', validators: validator.password },
				register: { type: 'checkbox', label: 'register' },
				submit: { type: 'submit' }
		  }
		: {
				username: { label: 'Username/Email', placeholder: 'Username/Email' },
				password: { type: 'password' },
				register: { type: 'checkbox', label: 'register' },
				submit: { type: 'submit' }
		  };

	async function handleSubmit() {
		const { username, password, email } = formData;

		if (!username || !password) return;
		if (register && !email) return;

		console.log('HandleSubmit', { username, email, password });

		if (register) {
			let err = [
				...validator.username.map((v) => v(username)).flat(),
				...validator.email.map((v) => v(email)).flat(),
				...validator.password.map((v) => v(password)).flat()
			].filter((v) => !!v);

			if (err.length) {
				errors = err as string[];
				return;
			}

			isLoading = true;

			const req = await api.register(username, email, password);

			if (req.ok) {
				await api.login(username, password);
			}

			isLoading = false;
		} else {
			const t = setTimeout(() => {
				isLoading = true;
			}, 500);

			const res = await api.login(username, password);

			clearTimeout(t);
			isLoading = false;
			if (res.ok) {
				createToast('Logged In', { type: 'success' });
			} else {
				errors = [res.message];
			}
		}
	}
</script>

{#if errors?.length}
	{#each errors as err}
		<p>{err}</p>
	{/each}
	<Button on:click={() => (errors = [])}>← Go Back</Button>
{:else if isLoading}
	<Icon name="branch" animated />
{:else if $userStore?._id}
	<div class="user">
		{#if $userStore?.profilePic}
			<img src={$userStore.profilePic} alt="" />
		{/if}
		<p>Hi, <b>{$userStore.username}</b></p>
	</div>
	<Button
		on:click={() => {
			api.logout();
			createToast('Logged Out', { type: 'success' });
		}}>logout</Button
	>
{:else}
	<Button icon="github" on:click={() => api.oauth('github')} --width="100%"
		>Login with GitHub</Button
	>

	<Form
		--min-width="180px"
		title={register ? 'Register' : 'Login'}
		fields={formFields}
		bind:data={formData}
		on:submit={() => handleSubmit()}
	/>
{/if}

<style>
	.user {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.user p {
		margin-left: 10px;
		margin: 0px;
	}
	.user img {
		border-radius: 100%;
		width: 50px;
	}
</style>
