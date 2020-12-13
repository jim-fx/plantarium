<script lang="ts">
  import { onMount } from 'svelte';

  import { NodeSystem } from '@plantarium/nodesystem';
  import Nodes from '@plantarium/nodes';
  import { Button } from '@plantarium/ui';

  import { ProjectManager } from './components/project-manager';
  import Scene from './components/scene/Scene.svelte';
  import { SettingsManager } from './components/settings-manager';
  import SettingsManagerView from './components/settings-manager/SettingsManagerView.svelte';
  import ProjectManagerView from './components/project-manager/ProjectManagerView.svelte';

  const defaultProject = {
    meta: { transform: { x: 0, y: 0, s: 1 } },
    nodes: [
      {
        attributes: {
          pos: { x: -100, y: 0 },
          type: 'stem',
          id: '1',
          refs: [{ id: '0', in: 'main' }],
        },
      },
      {
        attributes: { pos: { x: 0, y: 0 }, type: 'output', id: '0', refs: [] },
      },
    ],
  };

  let nodeSystemWrapper: HTMLDivElement;
  let projectManager: ProjectManager;
  let showPM = false;
  const settingsManager = new SettingsManager();

  onMount(() => {
    const nodeSystem = new NodeSystem({
      wrapper: nodeSystemWrapper,
      view: true,
      defaultNodes: false,
      registerNodes: (Nodes as unknown) as NodeTypeData[],
    });

    projectManager = new ProjectManager(nodeSystem, settingsManager);

    nodeSystem.load(
      JSON.parse(localStorage.getItem('nodesystem')) || defaultProject,
    );

    nodeSystem.on('save', (save) => {
      localStorage.setItem('nodesystem', JSON.stringify(save));
    });
  });
</script>

<style lang="scss">
  main {
    height: 100%;
    display: grid;
    grid-template-columns: minmax(50vw, 25%) 1fr;
  }

  header {
    .left,
    .right {
      display: inline-block;
    }
  }
</style>

<header>
  <div class="left">
    <div>
      <Button
        icon="Cog"
        name="Projects"
        cls="projects-icon"
        bind:active={showPM} />
      {#if projectManager}
        <ProjectManagerView pm={projectManager} visible={showPM} />
      {/if}
    </div>
  </div>

  <div class="right">
    <SettingsManagerView sm={settingsManager} />
  </div>
</header>
<main>
  <Scene pm={projectManager} />
  <div id="nodesystem-view" bind:this={nodeSystemWrapper} />
</main>
