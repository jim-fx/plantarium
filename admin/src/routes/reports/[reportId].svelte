<script lang="ts">

import { page } from "$app/stores";
import { api } from "$lib";
const { reportId } = $page.params;

</script>

{#await api.get("api/report/"+reportId)}

	Loading ... {reportId}

{:then report}

<h3>{report.type}</h3>
<p>
	{report}
</p>
{/await}

