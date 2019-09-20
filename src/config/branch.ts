import pm from "../components/project-manager";

export default {
  title: "branch",
  type: "stage",
  icon: "branch",
  children: [
    {
      type: "Checkbox",
      title: "Use Branches",
      default: true,
      init: (pd: plantDescription) => {
        return pd.branches.enable;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.branches.enable = <boolean>output.enabled;
        pm.updateUI();
      }
    },
    {
      type: "Number",
      title: "Amount",
      min: 1,
      max: 50,
      init: function(pd: plantDescription) {
        this.enabled = pd.branches.enable;
        return pd.branches.amount;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.branches.amount = output.value;
      }
    },
    {
      type: "Slider",
      title: "Gravity",
      min: 0,
      max: 1,
      init: function(pd: plantDescription) {
        this.enabled = pd.branches.enable;
        return pd.branches.gravity;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.branches.gravity = output.value;
      }
    },
    {
      type: "Slider",
      title: "Lowest Branch",
      tooltip: "position of the lowest branch along the stem",
      min: 0,
      max: 1,
      init: function(pd: plantDescription) {
        this.enabled = pd.branches.enable;
        return pd.branches.lowestBranch.value;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.branches.lowestBranch.value = output.value;
      }
    },
    {
      title: "Offset",
      type: "Group",
      children: [
        {
          type: "Slider",
          title: "Offset",
          tooltip: "offset the position of every 2nd branch along the stem",
          min: 0,
          max: 1,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.offset.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.branches.offset.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Offset Variation",
          min: 0,
          max: 1,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.offset.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.branches.offset.variation = output.value;
          }
        }
      ]
    },
    {
      title: "Length",
      type: "Group",
      children: [
        {
          type: "Slider",
          title: "Length",
          min: 0.05,
          max: 2,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.length.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.branches.length.value = output.value;
          }
        },
        {
          type: "Slider",
          default: 0,
          title: "Variation",
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.length.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.branches.length.variation;
            } else {
              originalState.branches.length.variation = output.value;
            }
          }
        },
        {
          type: "Curve",
          title: "Length",
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.length.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.branches.length.curve;
            } else {
              originalState.branches.length.curve = output.curve;
            }
          }
        }
      ]
    },
    {
      title: "Diameter",
      type: "Group",
      children: [
        {
          type: "Slider",
          title: "Diameter",
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.diameter.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.branches.diameter.value = output.value;
          }
        },
        {
          type: "Slider",
          default: 0,
          title: "Variation",
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.diameter.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.branches.diameter.variation;
            } else {
              originalState.branches.diameter.variation = output.value;
            }
          }
        },
        {
          type: "Curve",
          title: "Diameter",
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.diameter.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.branches.diameter.curve;
            } else {
              originalState.branches.diameter.curve = output.curve;
            }
          }
        }
      ]
    },
    {
      title: "Angle",
      type: "Group",
      children: [
        {
          type: "Slider",
          title: "Angle",
          min: -0.5,
          max: 0.5,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.angle.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.branches.angle.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Angle Variation",
          default: 0,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.angle.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.branches.angle.variation;
            } else {
              originalState.branches.angle.variation = output.value;
            }
          }
        },
        {
          type: "Curve",
          title: "Angle",
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.angle.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.branches.angle.curve;
            } else {
              originalState.branches.angle.curve = output.curve;
            }
          }
        }
      ]
    },
    {
      title: "Rotation",
      type: "Group",
      children: [
        {
          type: "Slider",
          title: "Rotation",
          tooltip: "rotates the branch around the stem",
          min: 0,
          max: 1,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.rotation.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.branches.rotation.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Rotation Variation",
          default: 0,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.rotation.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.branches.rotation.variation;
            } else {
              originalState.branches.rotation.variation = output.value;
            }
          }
        }
      ]
    },
    {
      type: "Group",
      title: "Noise",
      children: [
        {
          type: "Slider",
          title: "Scale",
          min: 1,
          max: 10,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.noiseScale;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.branches.noiseScale = output.value;
          }
        },
        {
          type: "Slider",
          title: "Strength",
          min: 0,
          max: 1,
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.noiseStrength.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.branches.noiseStrength.value = output.value;
          }
        },
        {
          type: "Curve",
          title: "Strength Curve",
          init: function(pd: plantDescription) {
            this.enabled = pd.branches.enable;
            return pd.branches.noiseStrength.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.branches.noiseStrength.curve;
            } else {
              originalState.branches.noiseStrength.curve = output.curve;
            }
          }
        }
      ]
    }
  ]
};
