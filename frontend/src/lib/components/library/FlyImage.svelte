<script lang="ts">
	import { onMount, tick } from 'svelte';

	export let img: HTMLImageElement;
	export let target: HTMLElement;

	let width = '0px';
	let height = '0px';
	let ox = '0px';
	let oy = '0px';
	let x = '0px';
	let y = '0px';
	let scale = 1;

	let visible = false;

	onMount(async () => {
		await tick();

		const imgRect = img.getBoundingClientRect();

		width = imgRect.width + 'px';
		height = imgRect.height + 'px';
		ox = imgRect.x + 'px';
		oy = imgRect.y + 'px';

		console.log({ img, width, height, x, y });

		setTimeout(() => {
			visible = true;
		}, 50);

		const targetRect = target.getBoundingClientRect();
		setTimeout(() => {
			x = -imgRect.x + targetRect.x + 'px';
			y = -imgRect.y + targetRect.y + 'px';
			scale = 0.2;
		}, 100);
	});
</script>

<div
	class="wrapper"
	class:visible
	style={`left:${ox}; top: ${oy}; width: ${width}; height: ${height}; transform: translate(${x},${y}) scale(${scale});`}
>
	<img src={img.src} alt={img.alt} />
</div>

<style>
	.wrapper {
		z-index: 99;
		position: absolute;
		opacity: 0;
		transition: opacity 0.1s ease;
		transform-origin: 0 0;
	}

	.wrapper > img {
		width: 100%;
		height: 100%;
	}

	.visible {
		opacity: 1;
		transition: transform 1s cubic-bezier(0.79, 0.33, 0.14, 0.53), opacity 0.1s ease;
	}
</style>
