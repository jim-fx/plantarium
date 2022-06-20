<script lang="ts">
	import type { PlantProject } from '@plantarium/types';

	export let plant: Promise<PlantProject>;
</script>

{#await plant then p}
	<img src={p.meta.thumbnail} alt="" />
{/await}
