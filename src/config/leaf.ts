import updateUI from "../helpers/updateUI";

export default {
  title: "leaf",
  type: "stage",
  children: [
    {
      type: "Checkbox",
      title: "Use Leaves",
      default: true,
      init: (pd: plantDescription) => {
        return pd.leaves.enable;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.leaves.enable = <boolean>output.enabled;
        updateUI();
      }
    },
    {
      type: "Number",
      title: "Amount",
      min: 1,
      max: 64,
      init: function(pd: plantDescription) {
        this.enabled = pd.leaves.enable;
        return pd.leaves.amount;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.leaves.amount = output.value;
      }
    },
    {
      type: "Slider",
      title: "Gravity",
      init: function(pd: plantDescription) {
        this.enabled = pd.leaves.enable;
        return pd.leaves.gravity;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.leaves.gravity = output.value;
      }
    },
    {
      type: "Group",
      title: "Distribution",
      children: [
        {
          type: "Slider",
          title: "Lowest Leaf",
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.lowestLeaf;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.lowestLeaf = output.value;
          }
        },
        {
          type: "Checkbox",
          title: "On Branches",
          default: true,
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable && pd.leaves.enable;
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
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.onStem;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.onStem = <boolean>output.enabled;
          }
        }
      ]
    },
    {
      title: "Offset",
      type: "Group",
      children: [
        {
          type: "Slider",
          title: "Offset",
          min: 0,
          max: 1,
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.offset.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.offset.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Offset Variation",
          min: 0,
          max: 1,
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.offset.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.offset.variation = output.value;
          }
        }
      ]
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
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.size.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.size.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Size Variation",
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.size.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.size.variation = output.value;
          }
        },
        {
          type: "Curve",
          title: "Size",
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
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
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.shape;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.shape = <point[]>output.shape;
          }
        },
        {
          type: "Curve",
          title: "X Curvature",
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.xCurvature.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.xCurvature.curve = output.curve;
          }
        },
        {
          type: "Slider",
          title: "X Curvature Strength",
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.xCurvature.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.xCurvature.value = output.value;
          }
        },
        {
          type: "Curve",
          title: "Y Curvature",
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.yCurvature.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.yCurvature.curve = output.curve;
          }
        },
        {
          type: "Slider",
          title: "Y Curvature Strength",
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.yCurvature.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.yCurvature.value = output.value;
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
          min: -1,
          max: 1,
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.angle.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.angle.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Angle Variation",
          default: 0,
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.angle.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.leaves.angle.variation;
            } else {
              originalState.leaves.angle.variation = output.value;
            }
          }
        },
        {
          type: "Curve",
          title: "Angle",
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.angle.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.leaves.angle.curve;
            } else {
              originalState.leaves.angle.curve = output.curve;
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
          min: 0,
          max: 1,
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.rotation.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.leaves.rotation.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Rotation Variation",
          default: 0,
          init: function(pd: plantDescription) {
            this.enabled = pd.leaves.enable;
            return pd.leaves.rotation.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.leaves.rotation.variation;
            } else {
              originalState.leaves.rotation.variation = output.value;
            }
          }
        }
      ]
    }
  ]
};
