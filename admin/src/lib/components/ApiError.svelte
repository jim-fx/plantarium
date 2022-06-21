<script lang="ts">
  export let error: { ok: boolean; statusCode: number; message: string };
</script>

<div class="wrapper">
  <b>{error.statusCode}:</b>
  {error.message}
</div>
