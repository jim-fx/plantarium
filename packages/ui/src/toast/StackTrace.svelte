<svelte:options tag={null} />

<script>
  export let stacktrace;
</script>

{#if stacktrace}
  <div class="wrapper">
    <p>
      <b>{stacktrace.type}:</b>
      {stacktrace.title}
    </p>
    <pre>
    <code>
      {#each stacktrace.lines as line}
          at <strong>{line.name}</strong>{#if line.alias}as <strong>${line.alias}</strong
            >{/if}{#if line.location}&nbsp;(<i>{line.location}</i>){/if}<br />
        {/each}
    </code>
  </pre>
  </div>
{/if}

<style>
  .wrapper {
    background-color: #303030;
    padding: 10px;
    margin: 0px;
    border-radius: 5px;
    overflow-x: auto;
  }

  pre {
    width: fit-content;
  }
</style>
