<script>
  import Layout from './Layout.svelte';

  export let reports;
</script>

<svelte:head>
  <title>Reports</title>
</svelte:head>

<Layout>
  <h3>List</h3>
  {#each reports as report}
    <p>{report.id}</p>
  {/each}
</Layout>
