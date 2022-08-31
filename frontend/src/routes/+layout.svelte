<script lang="ts">
	import { browser } from '$app/environment';
	import { logger } from '@plantarium/helpers';

	if (!browser) {
		// This disables the logger during build serverside
		logger.setFilter('');
	}
</script>

<slot />
