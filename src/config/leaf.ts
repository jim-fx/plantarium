export default {
  title: "leaf",
  type: "stage",
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
      title: "Shape",
      type: "group",
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
