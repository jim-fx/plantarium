<script>
  import { Button, createAlert } from '@plantarium/ui';
  import { Changelog } from '../../elements';
  import Report from '../../elements/Report.svelte';
  import { Tutor } from '../tutor';
</script>

<div>
  <Button
    name="Tutorial"
    icon="hand"
    --bg="#303030"
    --text="white"
    on:click={() => Tutor.restart()}
  />

  <Button
    name="Report Bug"
    icon="exclamation"
    --bg="#303030"
    --text="white"
    on:click={() =>
      createAlert(Report, {
        timeout: 0,
        title: 'Report Bug',
        type: 'error',
        props: { mode: 'bug' },
      })}
  />

  <Button
    name="Request Feature"
    --bg="#303030"
    --text="white"
    on:click={() =>
      createAlert(Report, {
        timeout: 0,
        title: 'Request Feature',
        props: { mode: 'feat' },
      })}
  />
  <Button
    name="Changelog"
    --bg="#303030"
    --text="white"
    on:click={() => createAlert(Changelog, { timeout: 0 })}
  />
</div>

<style lang="scss">
  div {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  div :global(button) {
    margin-bottom: 10px !important;
  }

  div :global(div:last-child button) {
    margin-bottom: 0px !important;
  }
</style>
