<script lang="ts">
	import PlantView from '$lib/elements/PlantView.svelte';
	import type { Project } from '@plantarium/types';

	import clientApi from '@plantarium/client-api';
	import { Gallery, GalleryItem } from '@plantarium/ui';

	export let project: Project;
</script>

<Gallery>
	<GalleryItem>
		<div class="item-wrapper">
			<PlantView {project} />
		</div>
	</GalleryItem>

	{#if project.meta.gbifID}
		{#await clientApi.getImagesForPlant(project.meta.gbifID)}
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
								alt="Image of {project.meta.scientificName ||
									project.meta.name ||
									project.meta.description}"
							/>
							<i style="font-size:0.5em">Image from {img.source}</i>
						</div>
					</GalleryItem>
				{/each}
			{/if}
		{/await}
	{/if}
</Gallery>

<style>
	.item-wrapper {
		height: 80%;
	}
	img {
		object-fit: contain;
	}
</style>
