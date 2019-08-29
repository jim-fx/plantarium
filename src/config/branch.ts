export default {
  title: "branch",
  type: "stage",
  children: [
    {
      title: "Diameter",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Diameter",
          init: (pd: plantDescription) => {
            return pd.branches.diameter.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.diameter.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          default: 0,
          title: "Variation",
          init: (pd: plantDescription) => {
            return pd.branches.diameter.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.value === 0) {
              delete originalState.branches.diameter.variation;
            } else {
              originalState.branches.diameter.variation = output.value;
            }
            updateState(originalState);
          }
        },
        {
          type: "Curve",
          title: "Diameter",
          init: (pd: plantDescription) => {
            return pd.branches.diameter.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.branches.diameter.curve;
            } else {
              originalState.branches.diameter.curve = output.curve;
            }
            updateState(originalState);
          }
        }
      ]
    }
  ]
};
