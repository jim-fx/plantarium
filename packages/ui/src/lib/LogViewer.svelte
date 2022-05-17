<script lang="ts">
  export let logs: { scope: string; args: unknown[]; level: number; date: number }[];

  function parseTime(s: number) {
    const d = new Date(s);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }
</script>

<div id="wrapper">
  <table>
    {#each logs as log}
      <tr>
        <td> {parseTime(log.date)}</td>
        <td><b>[{log.scope}]</b></td>
        <td>{log.args[0]}</td>
      </tr>
      {#if log.args[1]}
        <tr colspan="3">
          <td colspan="3">
            <details>
              <summary>args</summary>
              <pre><code>{JSON.stringify(log.args[1], null, 2)}</code><pre /></pre>
            </details>
          </td>
        </tr>
      {/if}
    {/each}
  </table>
</div>

<style>
  #wrapper {
    max-height: 300px;
    overflow-y: auto;
    background-color: var(--midground-color);
    border-radius: 5px;
  }
</style>
