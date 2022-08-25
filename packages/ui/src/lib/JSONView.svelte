<script lang="ts">
  import JsonTree from 'svelte-json-tree';
  export let value: unknown = {};
</script>

<div>
  <JsonTree {value} defaultExpandedLevel={1} />
</div>

<style>
  div {
    --json-tree-property-color: var(--text-color);
  }
  div > :global(ul .root) {
    display: none;
  }

  div > :global(ul span.arrow) {
    width: 10px;
    transform-origin: 40% 50%;
  }

  div > :global(ul) {
    outline: solid thin var(--outline-color);
    background-color: var(--midground-color);
    padding: 10px;
    margin: 0;
    border-radius: 5px;
  }

  :global(body.theme-dark) div {
    --json-tree-symbol-color: #ea898a;
    --json-tree-boolean-color: #748bff;
    --json-tree-number-color: #7771ff;
    --json-tree-label-color: #d676dd;
  }
</style>

