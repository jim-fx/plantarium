<script lang="ts">
  import { Button, InputCheckbox, Section } from '@plantarium/ui';

  export let mode: 'feat' | 'bug' = 'bug';
</script>

<label for="description">Description</label>
<input type="text" id="description" />

{#if mode === 'bug'}
  <div>
    <InputCheckbox />
    <p>Include Browser Features</p>
  </div>
  <Section name="What is that?">
    <ul>
      <li>Du</li>
      <li>Du</li>
      <li>Du</li>
      <li>Du</li>
    </ul>
  </Section>
{/if}

<Button --bg="white" --text-color="#303030" name="Submit" />
