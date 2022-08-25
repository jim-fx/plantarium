<script lang="ts">
  import type { parseStackTrace } from '@plantarium/helpers';
  export let stacktrace: ReturnType<typeof parseStackTrace>;
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
          at <strong>{line.methodName}</strong> <i>{line.file}</i><br />
        {/each}
    </code>
  </pre>
  </div>
{/if}

<style>
  .wrapper {
    background-color: var(--foreground-color, #303030);
    color: var(--text-color, white);
    padding: 10px;
    margin: 0px;
    border-radius: 5px;
    overflow-x: auto;
  }

  pre {
    width: fit-content;
  }
</style>
