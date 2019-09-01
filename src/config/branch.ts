export default {
  title: "branch",
  type: "stage",
  children: [
    {
      type: "Number",
      title: "Amount",
      min: 1,
      max: 50,
      init: (pd: plantDescription) => {
        return pd.branches.amount;
      },
      onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
        originalState.branches.amount = output.value;
        updateState(originalState);
      }
    },
    {
      type: "Slider",
      title: "Gravity",
      min: 0,
      max: 1,
      init: (pd: plantDescription) => {
        return pd.branches.gravity;
      },
      onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
        originalState.branches.gravity = output.value;
        updateState(originalState);
      }
    },
    {
      type: "Slider",
      title: "Lowest Branch",
      min: 0,
      max: 1,
      init: (pd: plantDescription) => {
        return pd.branches.lowestBranch.value;
      },
      onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
        originalState.branches.lowestBranch.value = output.value;
        updateState(originalState);
      }
    },
    {
      title: "Offset",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Offset",
          min: 0,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.branches.offset.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.offset.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "Offset Variation",
          min: 0,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.branches.offset.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.offset.variation = output.value;
            updateState(originalState);
          }
        }
      ]
    },
    {
      title: "Length",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Length",
          min: 0.05,
          max: 2,
          init: (pd: plantDescription) => {
            return pd.branches.length.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.length.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          default: 0,
          title: "Variation",
          init: (pd: plantDescription) => {
            return pd.branches.length.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.value === 0) {
              delete originalState.branches.length.variation;
            } else {
              originalState.branches.length.variation = output.value;
            }
            updateState(originalState);
          }
        },
        {
          type: "Curve",
          title: "Length",
          init: (pd: plantDescription) => {
            return pd.branches.length.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.branches.length.curve;
            } else {
              originalState.branches.length.curve = output.curve;
            }
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
    },
    {
      title: "Angle",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Angle",
          min: -1,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.branches.angle.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.angle.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "Angle Variation",
          default: 0,
          init: (pd: plantDescription) => {
            return pd.branches.angle.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.value === 0) {
              delete originalState.branches.angle.variation;
            } else {
              originalState.branches.angle.variation = output.value;
            }
            updateState(originalState);
          }
        },
        {
          type: "Curve",
          title: "Angle",
          init: (pd: plantDescription) => {
            return pd.branches.angle.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.branches.angle.curve;
            } else {
              originalState.branches.angle.curve = output.curve;
            }
            updateState(originalState);
          }
        }
      ]
    },
    {
      title: "Rotation",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Rotation",
          min: 0,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.branches.rotation.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.rotation.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "Rotation Variation",
          default: 0,
          init: (pd: plantDescription) => {
            return pd.branches.rotation.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.value === 0) {
              delete originalState.branches.rotation.variation;
            } else {
              originalState.branches.rotation.variation = output.value;
            }
            updateState(originalState);
          }
        }
      ]
    },
    {
      type: "group",
      title: "Noise",
      children: [
        {
          type: "Slider",
          title: "Scale",
          min: 1,
          max: 10,
          init: (pd: plantDescription) => {
            return pd.branches.noiseScale;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.noiseScale = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Slider",
          title: "Strength",
          min: 0,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.branches.noiseStrength.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.branches.noiseStrength.value = output.value;
            updateState(originalState);
          }
        },
        {
          type: "Curve",
          title: "Strength Curve",
          init: (pd: plantDescription) => {
            return pd.branches.noiseStrength.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.branches.noiseStrength.curve;
            } else {
              originalState.branches.noiseStrength.curve = output.curve;
            }
            updateState(originalState);
          }
        }
      ]
    }
  ]
};
