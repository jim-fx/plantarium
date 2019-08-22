const stemStage = {
  title: "stem",
  children: [
    {
      title: "Basic Settings",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Stem Diameter",
          onUpdate: (
            output: parameter,
            originalState: plantDescription,
            updateState: Function
          ) => {
            originalState.branches.diameter = output;

            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "Stem Diameter"
        },
        {
          type: "Checkbox",
          title: "Use Random"
        }
      ]
    },
    {
      type: "group",
      title: "Curves",
      children: [
        {
          type: "Curve",
          title: "Stem Diameter"
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
          onUpdate: (
            output: parameter,
            originalState: plantDescription,
            updateState: Function
          ) => {
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
          onUpdate: (
            output: parameter,
            originalState: plantDescription,
            updateState: Function
          ) => {
            originalState.stem.diameter = output;

            updateState(originalState);
          }
        }
      ]
    }
  ]
};

const stages: stageConfig[] = [stemStage, branchStage, leafStage];

export default stages;
