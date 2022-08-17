<script lang="ts">
	import { browser } from '$app/env';
	import { logger } from '@plantarium/helpers';

	if (!browser) {
		// This disables the logger during build serverside
		logger.setLevel(5);
	}
</script>

<slot />
