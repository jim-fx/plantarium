<script lang="ts">
	import { page } from '$app/stores';
	import user from './userStore';

	$: sites = [
		['/', 'Home'],
		['/reports', 'Reports'],
		['/login', 'Login'],
		$user?.username ? ['/profile', 'Profile'] : []
	];
</script>

{JSON.stringify($user)}

<div class="text-center">
	<nav class="rounded shadow-xl w-auto inline-block p-2 mx-auto object-center">
		{#each sites as [href, title]}
			{#if href}
				<a class="p-3 rounded" class:underline={href === $page.path} {href}>
					{title}
				</a>
			{/if}
		{/each}
	</nav>
</div>
