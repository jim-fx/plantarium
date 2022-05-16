<script lang="ts">
  import { NodeSystem } from '$lib';
  import { dev, stressTest, tutorial } from './_tutorial/projects';
  import Header from './_tutorial/Header.svelte';
  import nodes from './_tutorial/tutorial_nodes';
  import { Button } from '@plantarium/ui';
  import { onMount } from 'svelte';
  import TutorialManager from './_tutorial';
  import { goto } from '$app/navigation';

  let wrapper: HTMLDivElement;

  const tutorialManager = new TutorialManager();
  let system: NodeSystem;
  let loaded = false;
  const state = tutorialManager.stateStore;

  $: if (state && system && loaded) {
    console.log('SAVE', $state);
    localStorage.setItem(
      'tutorial',
      JSON.stringify({
        save: system.serialize(),
        state: $state,
      }),
    );
  }

  let backRef: string;

  onMount(() => {
    const u = new URL(window.location.toString());
    if (u.searchParams.has('ref')) {
      backRef = u.searchParams.get('ref');
      localStorage.setItem('ref', backRef);
    } else {
      backRef = localStorage.getItem('ref');
    }

    system = new NodeSystem({
      view: true,
      wrapper,
      defaultNodes: false,
      registerNodes: nodes,
      connectionColors: {
        fluid: '#797979',
        coffee_beans: '#915841',
        coffee_powder: '#2f1d1c',
      },
      showUpdates: true,
    });

    tutorialManager.nodeSystem = system;

    try {
      const nodeData =
        localStorage.getItem('tutorial') &&
        JSON.parse(localStorage.getItem('tutorial'));

      if (nodeData) {
        console.log('Looading', { nodeData });
        system.load(nodeData.save);
        tutorialManager.setState(nodeData.state);
      } else {
        system.load(tutorial);
      }
    } catch (err) {
      system.load(tutorial);
    }

    system.on('save', (save) => {
      localStorage.setItem(
        'tutorial',
        JSON.stringify({
          state: $state,
          save,
        }),
      );
    });

    tutorialManager.start();
    loaded = true;
  });
</script>

<Header>
  {#if $state === 'playing'}
    <Button
      name="Start Tutorial"
      on:click={() => tutorialManager.setState('level-0')}
    />
  {/if}
  <Button name="exit" icon="cross" on:click={() => goto(backRef || '/')} />
</Header>

<div id="node-system" bind:this={wrapper} />

<style>
  #node-system {
    height: 100vh;
    width: 100vw;
  }
</style>
