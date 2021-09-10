<script lang="ts">
	import { createForm } from 'svelte-forms-lib';
	import { api } from '$lib';

	const { form, handleChange, handleSubmit } = createForm({
		initialValues: {
			username: '',
			password: ''
		},
		onSubmit: (values) => {
			api.login(values.username, values.password);
		}
	});
</script>

<div
	class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col mx-auto"
	style="width: 500px;"
>
	<form on:submit={handleSubmit}>
		<label for="username">username</label>
		<input
			class="mb-4"
			id="username"
			name="username"
			type="username"
			on:change={handleChange}
			bind:value={$form.username}
		/>

		<label for="password">password</label>
		<input
			class="mb-6"
			id="password"
			name="password"
			type="password"
			on:change={handleChange}
			bind:value={$form.password}
		/>

		<button
			class="bg-blue-400 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
			type="submit">Submit</button
		>
	</form>
</div>

<style>
	label {
		@apply block text-grey-darker text-sm font-bold mb-2;
	}

	input {
		@apply shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker;
	}
</style>
