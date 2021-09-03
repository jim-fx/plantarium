<script>
  import Layout from './Layout.svelte';
  import Report from './components/Report.svelte';
  export let reports;
</script>

<svelte:head>
  <title>Reports</title>
</svelte:head>

<Layout>
  <h3>List</h3>
  {#each reports as report}
    <Report {report} />
  {/each}
</Layout>
