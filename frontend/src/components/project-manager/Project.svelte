<script lang="ts">
  import type { ProjectManager } from '.';
  import { humane } from '@plantarium/helpers';

  export let pm: ProjectManager;
  export let project: PlantProject;
</script>

<style lang="scss">
  @import '../../themes.scss';

  .project-wrapper {
    position: relative;
    height: 100px;
    padding: 4px;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 100px 1fr;

    > .project-image {
      background-image: url('../assets/rocky_dirt1-albedo.jpg');
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
            background-color: $light-red;
          }
        }
      }
    }

    &.active {
      background-color: lightblue;
    }
  }
</style>

<div
  class="project-wrapper"
  class:active={project.meta.id === pm.activeProjectId}
  on:click={() => pm.setActiveProject(project.meta.id)}>
  <div class="project-image">
    <!--  -->
  </div>
  <div class="project-content">
    <div class="project-content-header">
      <h3
        contenteditable
        on:input={function (ev) {
          pm.updateProjectMeta(project.meta.id, {
            name: ev.currentTarget.innerText,
          });
        }}>
        {project.meta.name}
      </h3>
      <p>{humane.time(Date.now() - project.meta.lastSaved)} ago</p>
    </div>
    <div class="project-content-main" />
    <div class="project-content-footer">
      <button
        class="delete"
        on:click|stopPropagation={() => pm.deleteProject(project.meta.id)}>delete</button>
    </div>
  </div>
</div>
