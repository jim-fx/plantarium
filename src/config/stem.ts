export default {
  title: "stem",
  type: "stage",
  children: [
    {
      title: "Amount",
      type: "group",
      children: [
        {
          type: "Number",
          title: "Amount",
          init: (pd: plantDescription) => {
            return pd.stem.amount.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.stem.amount.value = output.value;
            updateState(originalState);
          }
        }
      ]
    },
    {
      title: "Diameter",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Diameter",
          init: (pd: plantDescription) => {
            return pd.stem.diameter.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.stem.diameter.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "Diameter Variation",
          default: 0,
          init: (pd: plantDescription) => {
            return pd.stem.diameter.variation;
          },
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
          init: (pd: plantDescription) => {
            return pd.stem.diameter.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.stem.diameter.curve;
            } else {
              originalState.stem.diameter.curve = output.curve;
            }
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
          min: 1,
          max: 10,
          init: (pd: plantDescription) => {
            return pd.stem.height.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.stem.height.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          default: 0,
          title: "Height Variation",
          init: (pd: plantDescription) => {
            return pd.stem.height.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.value === 0) {
              delete originalState.stem.height.variation;
            } else {
              originalState.stem.height.variation = output.value;
            }
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          default: 1,
          title: "Noise Scale",
          min: 0.1,
          max: 10,
          init: (pd: plantDescription) => {
            return pd.stem.noiseScale;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.stem.noiseScale = output.value;
            updateState(originalState);
          }
        }
      ]
    }
  ]
};
