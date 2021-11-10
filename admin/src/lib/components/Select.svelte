<script lang="ts">
  import MultiSelect from 'svelte-multiselect';

  export let values = [];

  export let selected: string;
</script>

<MultiSelect bind:selected options={values} />
