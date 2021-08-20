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
        at {line.name} {line.alias?`as ${line.alias}`:""}<br>
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
    overflow-x: scroll;
  }

  pre {
    width: fit-content;
  }
</style>
