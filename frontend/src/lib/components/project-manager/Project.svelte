<script lang="ts">
  import { humane } from '@plantarium/helpers';
  import { projectManager } from '..';

  export let project: PlantProject;

  let active = false;
  function fakeActive() {
    active = true;
    setTimeout(() => {
      active = false;
    }, 100);
    return true;
  }
</script>

<div
  class="project-wrapper"
  class:active={project.meta.id === projectManager.activeProjectId || active}
  on:resize={alert}
  on:click={() =>
    fakeActive() && projectManager.setActiveProject(project.meta.id)}
>
  <div
    class="project-image"
    style="background-image: url({project.meta.thumbnail})"
  >
    <!--  -->
  </div>
  <div class="project-content">
    <div class="project-content-header">
      <input
        contenteditable
        value={project.meta.name}
        on:blur={function () {
          const value = this.value.split('\n').join('').trim();
          projectManager.updateProjectMeta(project.meta.id, { name: value });
        }}
        on:keydown={function (ev) {
          if (ev.key === 'Enter') {
            const value = this.value.split('\n').join('').trim();
            this.blur();
            ev.preventDefault();
            projectManager.updateProjectMeta(project.meta.id, { name: value });
          }
        }}
      />

      <p>{humane.time(Date.now() - project.meta.lastSaved)} ago</p>
    </div>
    <div class="project-content-main" />
    <div class="project-content-footer">
      <button
        class="delete"
        on:click|stopPropagation={() =>
          projectManager.deleteProject(project.meta.id)}>delete</button
      >
    </div>
  </div>
</div>

<style lang="scss">
  @use '~@plantarium/theme/src/themes.module.scss';

  .project-wrapper {
    position: relative;
    min-height: 100px;
    padding: 4px;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 100px 1fr;
    color: #303030;

    > .project-image {
      background-image: url('../assets/rocky_dirt1-albedo.jpg');
      background-color: var(--foreground-color);
      border-radius: 10px;
      background-size: cover;
      width: 100px;
      height: 100%;
      display: inline-block;
    }

    > .project-content {
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding-left: 5px;

      > .project-content-header {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        justify-content: space-between;

        > p {
          font-size: 0.8em;
        }
      }

      > .project-content-footer {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;

        > button {
          font-size: 0.8em;
          border: none;
          border-radius: 6px;
          margin: 0;
          margin-right: 5px;

          &.delete {
            background-color: themes.$light-red;
          }
        }
      }
    }

    &.active {
      background-color: lightblue;
    }
  }
</style>
