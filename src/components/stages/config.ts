const stemStage = {
  title: "stem",
  children: [
    {
      title: "Diameter",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Diameter",
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.stem.diameter.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          default: 0,
          title: "Diameter Variation",
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.value === 0) {
              delete originalState.stem.diameter.variation;
            } else {
              originalState.stem.diameter.variation = output.value;
            }
            updateState(originalState);
          }
        },
        {
          type: "Curve",
          title: "Stem Diameter",
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.curve.length <= 2) {
              delete originalState.stem.diameter.curve;
            } else {
              originalState.stem.diameter.curve = output.curve;
            }
            console.log(originalState.stem.diameter);
            updateState(originalState);
          }
        }
      ]
    },
    {
      type: "group",
      title: "Height",
      children: [
        {
          type: "Slider",
          title: "Height",
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.stem.height.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          default: 0,
          title: "Height Variation",
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.value === 0) {
              delete originalState.stem.height.variation;
            } else {
              originalState.stem.height.variation = output.value;
            }
            updateState(originalState);
          }
        }
      ]
    }
  ]
};

const branchStage = {
  title: "branch",
  children: [
    {
      title: "Basic Settings",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Stem Diameter",
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.diameter = output;

            updateState(originalState);
          }
        }
      ]
    }
  ]
};

const leafStage = {
  title: "leaf",
  children: [
    {
      title: "Basic Settings",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Stem Diameter",
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.stem.diameter = output;

            updateState(originalState);
          }
        }
      ]
    }
  ]
};

const IOStage = {
  title: "import/export",
  children: [
    {
      type: "Button",
      title: "Stem Diameter"
    }
  ]
};

const stages: stageConfig[] = [stemStage, branchStage, leafStage, IOStage];

export default stages;
