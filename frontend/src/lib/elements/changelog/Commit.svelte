<script lang="ts">
  import type ICommit from './ICommit';

  export let commit: ICommit;

  export let isNew = false;
</script>

<p>
  {@html isNew ? '<b>[NEW]</b>' : ''}
  {commit.subject}
</p>
