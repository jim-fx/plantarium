<script lang="ts">
	import * as api from '@plantarium/client-api';
	import { validator } from '@plantarium/helpers';
	import { slide } from 'svelte/transition';
	import { Button, InputText, InputCheckbox, createToast } from '@plantarium/ui';
	import Icon from '@plantarium/ui/src/lib/Icon.svelte';

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

	let username: string;
	let email: string;
	let password: string;

	let errors: string[] = [];
	let isLoading = false;

	async function handleSubmit() {
		if (!username || !password) return;
		if (register && !email) return;

		console.log('HandleSubmit', { username, email, password });

		if (register) {
			let err = [
				...validator.username.map((v) => v(username)).flat(),
				...validator.email.map((v) => v(email)).flat(),
				...validator.password.map((v) => v(password)).flat()
			].filter((v) => !!v);

			console.log({ err });
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

<div style="min-width: 200px;" />

{#if errors?.length}
	{#each errors as err}
		<p>{err}</p>
	{/each}
	<Button name="← Go Back" on:click={() => (errors = [])} />
{:else if isLoading}
	<Icon name="branch" animated />
{:else if $userStore?._id}
	<br />

	<div class="user">
		{#if $userStore?.profilePic}
			<img src={$userStore.profilePic} alt="" />
		{/if}
		<p>Hi, <b>{$userStore.username}</b></p>
	</div>
	<br />
	<Button
		name="logout"
		on:click={() => {
			api.logout();
			createToast('Logged Out', { type: 'success' });
		}}
	/>
{:else}
	<Button
		icon="github"
		on:click={() => api.oauth('github')}
		name="Login with GitHub"
		--width="100%"
	/>
	<br />
	<h3>Login / Register</h3>

	<InputText
		bind:value={username}
		placeholder={register ? 'Username' : 'Username/Email'}
		validators={register ? validator.username : []}
		asyncValidators={register ? [checkUsernameExists] : []}
	/>

	{#if register}
		<div in:slide>
			<InputText bind:value={email} asyncValidators={[checkEmailExists]} type="email" />
		</div>
	{/if}

	<InputText bind:value={password} validators={register} type="password" />

	<br />
	<InputCheckbox bind:value={register} label="Register" />

	<br />
	<Button
		name={register ? 'register' : 'login'}
		on:click={handleSubmit}
		disabled={register ? !(email && username && password) : !(username && password)}
	/>
{/if}

<style>
	.user {
		display: flex;
		align-items: center;
	}
	.user p {
		margin-left: 10px;
	}
	.user img {
		border-radius: 100%;
		width: 50px;
	}
</style>
