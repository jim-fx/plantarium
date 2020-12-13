<script lang="ts">
  import { onMount } from 'svelte';

  import Renderer from '@plantarium/renderer';
  import { NodeSystem } from '@plantarium/nodesystem';
  import Nodes from '@plantarium/nodes';

  import { ProjectManager } from './components/project-manager';
  import Scene from './components/scene/Scene.svelte';
  import { SettingsManager } from './components/settings-manager';

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

  let renderCanvas: HTMLCanvasElement;
  let nodeSystemWrapper: HTMLDivElement;
  let projectManager: ProjectManager;

  onMount(() => {
    const nodeSystem = new NodeSystem({
      wrapper: nodeSystemWrapper,
      view: true,
      defaultNodes: false,
      registerNodes: (Nodes as unknown) as NodeTypeData[],
    });

    const settingsManager = new SettingsManager();

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
  @import './themes';

  main {
    height: 100%;
    display: grid;

    grid-template-columns: minmax(50vw, 25%) 1fr;
  }
</style>

<header>
  <h2>Eyy</h2>
</header>
<main>
  <Scene pm={projectManager} />
  <div id="nodesystem-view" bind:this={nodeSystemWrapper} />
</main>
