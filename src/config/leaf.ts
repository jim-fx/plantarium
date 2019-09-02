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
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.leaves.amount = output.value;
      }
    },
    {
      type: "Slider",
      title: "Gravity",
      init: (pd: plantDescription) => {
        return pd.leaves.gravity;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.leaves.gravity = output.value;
      }
    },
    {
      type: "Checkbox",
      title: "On Branches",
      default: true,
      init: (pd: plantDescription) => {
        return pd.leaves.onBranches;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.leaves.onBranches = <boolean>output.enabled;
      }
    },
    {
      type: "Checkbox",
      title: "On Stem",
      default: false,
      init: (pd: plantDescription) => {
        return pd.leaves.onStem;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.leaves.onStem = <boolean>output.enabled;
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
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.size.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Size Variation",
          init: (pd: plantDescription) => {
            return pd.leaves.size.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.size.variation = output.value;
          }
        },
        {
          type: "Curve",
          title: "Size",
          init: (pd: plantDescription) => {
            return pd.leaves.size.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.size.curve = output.curve;
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
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.shape = <point[]>output.shape;
          }
        },
        {
          type: "Curve",
          title: "X Curvature",
          init: (pd: plantDescription) => {
            return pd.leaves.xCurvature.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.xCurvature.curve = output.curve;
          }
        },
        {
          type: "Slider",
          title: "X Curvature Strength",
          init: (pd: plantDescription) => {
            return pd.leaves.xCurvature.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.xCurvature.value = output.value;
          }
        },
        {
          type: "Curve",
          title: "Y Curvature",
          init: (pd: plantDescription) => {
            return pd.leaves.yCurvature.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.yCurvature.curve = output.curve;
          }
        },
        {
          type: "Slider",
          title: "Y Curvature Strength",
          init: (pd: plantDescription) => {
            return pd.leaves.yCurvature.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.yCurvature.value = output.value;
          }
        }
      ]
    }
  ]
};
