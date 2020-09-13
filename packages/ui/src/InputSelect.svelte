<script>
  let selectedValue = undefined;
  let open = false;
  let main;

  function handleChange() {
    const event = new CustomEvent('change', {
      detail: selectedValue,
      bubbles: true,
      cancelable: true,
      composed: true, // makes the event jump shadow DOM boundary
    });

    main.dispatchEvent(event);
  }

  $: selectedValue && handleChange(selectedValue);

  function handleOpen() {
    open = true;
    setTimeout(() => {
      document.addEventListener(
        'click',
        () => {
          open = false;
        },
        { once: true },
      );
    }, 50);
  }

  function setSelected(value) {
    selectedValue = value;
    open = false;
  }

  let items = [];
  export function setItems(_items) {
    items = _items;
  }

  export function setValue(v) {
    selectedValue = v;
  }
</script>

<style>
  #main {
    background-color: #4b4b4b;
    color: white;
    border-radius: 2px;
    position: relative;
    font-size: 0.6em;
    padding: 8%;
  }

  #selected-value {
    padding: 0px 2px;
  }

  #item-wrapper {
    position: absolute;
    width: 100%;
    background-color: #4b4b4b;
    border-radius: 2px;
    overflow: hidden;
    top: 0;
    z-index: 99;
    left: 0;
  }

  .item {
    padding: 8%;
    margin: 0;
    background-color: #4b4b4b;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .item:hover {
    background-color: #3d3d3d;
  }
</style>

<svelte:options tag="plant-select" />

<div id="main" bind:this={main}>
  {#if selectedValue !== undefined}
    <div id="selected-value" on:click={handleOpen}>{selectedValue}</div>
  {:else}
    <div id="selected-value" on:click={handleOpen}>none</div>
  {/if}

  {#if open}
    <div id="item-wrapper">
      {#each items as item}
        <p
          style={`opacity: ${item === selectedValue ? 0.5 : 1}`}
          class="item"
          on:click={() => setSelected(item)}>
          {item}
        </p>
      {/each}
    </div>
  {/if}
</div>
