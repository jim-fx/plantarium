<script lang="ts">
  import { NodeSystem } from '$lib';
  import { dev, stressTest } from './_tutorial/projects';
  import Header from './_tutorial/Header.svelte';
  import nodes from '$lib/nodes/ExampleNodes';
  import { onMount } from 'svelte';
  import { Button } from '@plantarium/ui';
  import { goto } from '$app/navigation';

  let wrapper: HTMLDivElement;
  let system: NodeSystem;

  onMount(() => {
    console.log({ nodes });

    system = new NodeSystem({
      view: true,
      wrapper,
      defaultNodes: true,
      registerNodes: nodes,
      showUpdates: true,
    });

    setTimeout(() => {
      try {
        const nodeData =
          localStorage.getItem('system-0') &&
          JSON.parse(localStorage.getItem('system-0'));
        system.load(nodeData);
      } catch (err) {
        console.log(err);
      }
    }, 1000);

    system.on('save', (save) => {
      localStorage.setItem('system-0', JSON.stringify(save));
    });
  });
</script>

<Header>
  <Button name="Load StressTest" on:click={() => system.load(stressTest)} />
  <Button name="Load Dev" on:click={() => system.load(dev)} />
  <Button icon="question" name="Tutorial" on:click={() => goto('/tutorial')} />
</Header>

<div id="node-system" bind:this={wrapper} />

<style>
  #node-system {
    height: 100vh;
    width: 100vw;
  }
</style>
