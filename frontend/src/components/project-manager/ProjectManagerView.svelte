<script lang="ts">
  import type ProjectManager from './ProjectManager';
  export let pm: ProjectManager;

  export let visible = false;

  const projects = [
    {
      name: 'Fern02',
    },
    {
      name: 'Fern02',
    },
    {
      name: 'Fern02',
    },
    {
      name: 'Fern02',
    },
    {
      name: 'Fern02',
    },
    {
      name: 'Fern02',
    },
  ];

  pm.on('save', () => {});
</script>

<style lang="scss">
  @import '../../themes.scss';
  .wrapper {
    position: relative;
    margin-top: -8px;
    width: fit-content;
    background-color: $light-green;
    opacity: 0;
    pointer-events: none;
    resize: both;
    border-radius: 0px 5px 5px 5px;

    resize: both;
    overflow: auto;
    min-width: 300px;
    overflow-x: hidden;
    min-height: 300px;
    max-height: 80vh;
    max-width: 500px;
  }

  .visible {
    opacity: 1;
    pointer-events: all;
  }

  .header {
    position: sticky;
    top: 0px;
    left: 0px;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    column-gap: 5px;
    padding: 20px;
    z-index: 99;
    min-height: 30px;
    padding-bottom: 0px;
    top: 0px;
    left: 0px;
    background: linear-gradient(0deg, #65e29f00 0%, #65e29f 50%);
    padding-right: 15px;
  }

  .header > div {
    height: 100%;
    background-color: red;
    border-radius: 5px;
  }

  .header > div > p {
    padding: 5px;
  }

  .project-list {
    overflow-y: hidden;
    overflow-x: hidden;
    padding: 10px;
    padding-right: 15px;
  }

  .project-wrapper {
    position: relative;
    height: 100px;
    padding: 10px;
    border-radius: 10px;

    > .project-image {
      background-image: url('../assets/rocky_dirt1-albedo.jpg');
      border-radius: 10px;
      background-size: cover;
      width: 100px;
      height: 100%;
      display: inline-block;
    }

    > .project-content {
      display: inline-block;
    }

    &.active {
      background-color: lightblue;
    }
  }
</style>

<div class="wrapper" class:visible>
  <div class="header">
    <div class="add-new">
      <p>new</p>
    </div>
    <div class="search">
      <p>search</p>
    </div>
    <div class="sort">
      <p>sort</p>
    </div>
    <div class="close">
      <p>x</p>
    </div>
  </div>

  <div class="project-list">
    {#each projects as project}
      <div class="project-wrapper" class:active={Math.random() > 0.5}>
        <div class="project-image">
          <!--  -->
        </div>
        <div class="project-content">
          <h3>{project.name}</h3>
        </div>
      </div>
    {/each}
  </div>
</div>
