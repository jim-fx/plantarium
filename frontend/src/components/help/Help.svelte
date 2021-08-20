<script>
  import { Button } from '@plantarium/ui';
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
    disabled
  />

  <Button name="Request Feature" --bg="#303030" --text="white" disabled />
  <Button name="Changelog" --bg="#303030" --text="white" disabled />
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
