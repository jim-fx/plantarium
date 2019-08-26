import importer from "./components/io/importer";
import defaultPD from "./assets/defaultPlantDefinition";

const stemConfig = {
  title: "stem",
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
        }
      ]
    }
  ]
};

const branchConfig = {
  title: "branch",
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

const leafConfig = {
  title: "leaf",
  children: [
    {
      title: "Basic Settings",
      type: "group",
      children: [
        {
          type: "Slider",
          title: "Size",
          init: (pd: plantDescription) => {
            return pd.leaves.size.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.size.value = output.value;
            updateState(originalState);
          }
        }
      ]
    },
    {
      title: "Shape",
      type: "group",
      children: [
        {
          type: "LeafCreator",
          title: "Leaf Shape",
          init: (pd: plantDescription) => {
            return pd.leaves.shape;
          },
          onUpdate: (output: parameter, originalState: plantDescription, updateState: Function) => {
            originalState.leaves.shape = <point[]>output.shape;
            updateState(originalState);
          }
        }
      ]
    }
  ]
};

const IOConfig = {
  title: "import/export",
  children: [
    {
      type: "ProjectMeta",
      identifiers: ["name", "author", "latinName", "class", "family"],
      init: (pd: plantDescription) => {
        return pd.meta;
      },
      onUpdate: (output: plantMetaInfo, originalState: plantDescription, updateState: Function) => {
        originalState.meta = output;
        updateState(originalState);
      }
    },
    {
      type: "group",
      title: "Projects",
      children: [
        {
          type: "Button",
          title: "Stem Diameter",
          onClick: () => {
            importer.init(defaultPD);
          }
        }
      ]
    },
    {
      type: "group",
      title: "Import",
      children: [
        {
          type: "Button",
          title: "Stem Diameter",
          onClick: () => {
            importer.init(defaultPD);
          }
        }
      ]
    },
    {
      type: "group",
      title: "Export",
      children: [
        {
          type: "Number",
          title: "amount",
          default: 10,
          onUpdate: () => {}
        },
        {
          type: "Checkbox",
          title: "use seed",
          onUpdate: () => {}
        },
        {
          type: "Number",
          title: "seed",
          min: 0,
          max: 100000,
          default: Math.floor(Math.random() * 100000),
          onUpdate: () => {}
        },
        {
          type: "Button",
          title: "download models",
          onClick: () => {
            importer.init(defaultPD);
          }
        }
      ]
    }
  ]
};

export { stemConfig, branchConfig, leafConfig, IOConfig };
