export default {
  title: "leaf",
  type: "stage",
  children: [
    {
      type: "Number",
      title: "Amount",
      min: 3,
      max: 64,
      init: (pd: plantDescription) => {
        return pd.leaves.amount;
      },
      onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
        originalState.leaves.amount = output.value;
        updateState(originalState);
      }
    },
    {
      type: "Slider",
      title: "Gravity",
      init: (pd: plantDescription) => {
        return pd.leaves.gravity;
      },
      onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
        originalState.leaves.gravity = output.value;
        updateState(originalState);
      }
    },
    {
      type: "Checkbox",
      title: "On Branches",
      default: true,
      init: (pd: plantDescription) => {
        return pd.leaves.onBranches;
      },
      onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
        originalState.leaves.onBranches = <boolean>output.enabled;
        updateState(originalState);
      }
    },
    {
      type: "Checkbox",
      title: "On Stem",
      default: false,
      init: (pd: plantDescription) => {
        return pd.leaves.onStem;
      },
      onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
        originalState.leaves.onStem = <boolean>output.enabled;
        updateState(originalState);
      }
    },
    {
      type: "Group",
      title: "Size",
      children: [
        {
          type: "Slider",
          title: "Size",
          min: 0.1,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.leaves.size.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.size.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "Size Variation",
          init: (pd: plantDescription) => {
            return pd.leaves.size.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.size.variation = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Curve",
          title: "Size",
          init: (pd: plantDescription) => {
            return pd.leaves.size.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.size.curve = output.curve;
            updateState(originalState);
          }
        }
      ]
    },
    {
      title: "Shape",
      type: "Group",
      children: [
        {
          type: "LeafCreator",
          title: "Outline",
          init: (pd: plantDescription) => {
            return pd.leaves.shape;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.shape = <point[]>output.shape;
            updateState(originalState);
          }
        },
        {
          type: "Curve",
          title: "X Curvature",
          init: (pd: plantDescription) => {
            return pd.leaves.xCurvature.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.xCurvature.curve = output.curve;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "X Curvature Strength",
          init: (pd: plantDescription) => {
            return pd.leaves.xCurvature.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.xCurvature.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Curve",
          title: "Y Curvature",
          init: (pd: plantDescription) => {
            return pd.leaves.yCurvature.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.yCurvature.curve = output.curve;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "Y Curvature Strength",
          init: (pd: plantDescription) => {
            return pd.leaves.yCurvature.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.yCurvature.value = output.value;
            updateState(originalState);
          }
        }
      ]
    }
  ]
};
