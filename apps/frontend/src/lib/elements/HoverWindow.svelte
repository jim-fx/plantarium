<script lang="ts">
	import { ThemeStore } from '@plantarium/theme';
	import { Button } from '@plantarium/ui';
	import type { IconType } from '@plantarium/ui/src/Icon.svelte';
	import { clickOutside } from '@plantarium/helpers';

	export let name = '';
	export let right = false;
	export let icon: IconType;

	export let visible = false;
</script>

<div
	class="hover-wrapper"
	class:active={visible}
	use:clickOutside
	on:click_outside={() => {
		visible = false;
	}}
>
	<Button
		useActive
		{icon}
		--border-radius="5px 5px 0px 0px"
		--bg="transparent"
		--text={'var(--text-color)'}
		bind:active={visible}
	>
		{name}
	</Button>

	<div class="wrapper" class:visible class:right>
		<slot {visible} />
	</div>
</div>

<style>
	.hover-wrapper {
		position: relative;
	}

	.wrapper {
		position: absolute;
		width: fit-content;
		background-color: var(--accent);
		pointer-events: none;
		display: none;

		border-radius: 5px;
		padding: 10px;
		margin-top: 0px;

		overflow: auto;

		min-width: var(--min-width, unset);
		max-height: 70vh;
		max-width: 500px;
		border-top-left-radius: 0px;
	}

	.wrapper.right {
		right: 0px;
		border-top-right-radius: 0px;
		border-top-left-radius: 5px;
	}

	.visible {
		display: block;
		pointer-events: all;
	}
</style>
