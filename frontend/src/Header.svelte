<script lang="ts">
  import HelpView from './components/help/Help.svelte';
  import HoverWindow from './components/HoverWindow.svelte';
  import type { ProjectManager } from './components/project-manager';
  import ProjectManagerView from './components/project-manager/ProjectManagerView.svelte';
  import type { SettingsManager } from './components/settings-manager';
  import SettingsManagerView from './components/settings-manager/SettingsManagerView.svelte';

  export let projectManager: ProjectManager;
  export let settingsManager: SettingsManager;

  const activeProject = projectManager.activeProject;

  let showPM = false;
  let showSM = false;
  let showHelp = false;
</script>

<header>
  <div class="left">
    <HoverWindow icon="folder" name="Projects" component={ProjectManagerView} />
  </div>

  <h3>{$activeProject?.meta.name ?? ''}</h3>

  <div class="right">
    <HoverWindow icon="question" component={HelpView} right />
    <HoverWindow
      icon="cog"
      component={SettingsManagerView}
      right
      --min-width={'250px'}
    />
  </div>
</header>

<style lang="scss">
  @use '~@plantarium/theme/src/themes.module.scss';

  h3 {
    color: themes.$light-green;
  }

  header {
    display: flex;
    z-index: 2;
    align-items: center;
    justify-content: space-between;
    background-color: var(--foreground-color);
  }

  .right {
    display: flex;
  }

  .settings-wrapper,
  .help-wrapper,
  .project-wrapper {
    &.active {
      filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }
  }
</style>
