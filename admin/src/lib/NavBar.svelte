<script lang="ts">
	import { base } from '$app/paths';

	import { page } from '$app/stores';
	import user from './userStore';

	$: sites = [
		['/', 'Home'],
		['/reports', 'Reports'],
		['/login', 'Login'],
		$user?.username ? ['/profile', 'Profile'] : []
	];
</script>

<div class="text-center">
	<nav class="rounded bg-white shadow-xl w-auto inline-block p-2 mx-auto object-center">
		{#each sites as [href, title]}
			{#if href}
				<a class="p-3 rounded" class:underline={href === $page.path} href={base + href}>
					{title}
				</a>
			{/if}
		{/each}
	</nav>
</div>
