<script lang="ts">
	import PlantView from '$lib/elements/PlantView.svelte';
	import type { Project } from '@plantarium/backend';

	import clientApi from '@plantarium/client-api';
	import { Gallery, GalleryItem } from '@plantarium/ui';

	export let project: Promise<Project>;
</script>

{#await project then { data: p }}
	<Gallery>
		<GalleryItem>
			<div class="item-wrapper">
				<PlantView project={p} />
			</div>
		</GalleryItem>

		{#if p.meta.gbifID}
			{#await clientApi.getImagesForPlant(p.meta.gbifID)}
				<GalleryItem>
					<p>Loading</p>
				</GalleryItem>
			{:then res}
				{#if res.ok}
					{#each res.data.results as img, i (i)}
						<GalleryItem>
							<div class="item-wrapper">
								<img
									style="width: 100%; max-height: 100%;"
									src={img.identifier}
									alt="Image of {p.meta.latinName || p.meta.name || p.meta.description}"
								/>
								<i style="font-size:0.5em">Image from {img.source}</i>
							</div>
						</GalleryItem>
					{/each}
				{/if}
			{/await}
		{/if}
	</Gallery>
{/await}

<style>
	.item-wrapper {
		height: 80%;
	}
	img {
		object-fit: contain;
	}
</style>
