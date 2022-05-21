<script lang="ts">
  export let animated = false;
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class:animated>
  <title>branch</title>
  <path id="right-branch" d="M49.59,57.35,72.15,38.69" />
  <path id="top-left-branch" d="M51.58,29.45,38,11.21" />
  <path id="low-left-branch" d="M53.14,82.61,21.78,55.74" />
  <path id="low-left-small-branch" d="M37.108 68.971L33.812 47.849" />
  <polyline points="56 97 50 58 51 28 56 16" />
</svg>

<style>
  .animated > polyline {
    stroke-dasharray: 100;
    animation: mainBranch 2s infinite alternate;
  }

  @keyframes mainBranch {
    0% {
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  .animated > #right-branch {
    stroke-dasharray: 40;
    animation: rightBranch 2s infinite alternate;
  }
  @keyframes rightBranch {
    0% {
      stroke-dashoffset: 40;
    }

    30% {
      stroke-dashoffset: 40;
    }
    70% {
      stroke-dashoffset: 0;
    }
  }

  .animated > #low-left-branch {
    stroke-dasharray: 50;
    animation: lowLeftBranch 2s infinite alternate;
  }
  @keyframes lowLeftBranch {
    0% {
      stroke-dashoffset: 50;
    }
    10% {
      stroke-dashoffset: 50;
    }
    50% {
      stroke-dashoffset: 0;
    }
  }

  .animated > #low-left-small-branch {
    stroke-dasharray: 22;
    animation: lowLeftSmallBranch 2s infinite alternate;
  }
  @keyframes lowLeftSmallBranch {
    0% {
      stroke-dashoffset: 22;
    }
    50% {
      stroke-dashoffset: 22;
    }
    80% {
      stroke-dashoffset: 0;
    }
  }

  .animated > #top-left-branch {
    stroke-dasharray: 30;
    animation: topLeftBranch 2s infinite alternate;
  }
  @keyframes topLeftBranch {
    0% {
      stroke-dashoffset: 30;
    }
    70% {
      stroke-dashoffset: 30;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
</style>
