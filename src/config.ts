import projectManager from "./components/project-manager";
import settings from "./components/settings";

function getSeed(seed: number | undefined) {
  if (typeof seed === "number") {
    return seed;
  } else {
    return Math.floor(Math.random() * 100000);
  }
}

const stemConfig: UIConfig = {
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

const branchConfig: UIConfig = {
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

const leafConfig: UIConfig = {
  title: "leaf",
  type: "stage",
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

const IOConfig: UIConfig = {
  title: "import/export",
  type: "stage",
  children: [
    {
      type: "Button",
      title: "remove all",
      onClick: () => projectManager.removeAllProjects()
    },
    {
      type: "ProjectMeta",
      title: "Project Meta",
      identifiers: ["name", "author", "latinName", "class", "family"],
      init: (pd: plantDescription) => {
        return pd.meta;
      },
      onUpdate: (output: plantMetaInfo, originalState: plantDescription) => {
        projectManager.updateMeta(originalState.meta, output);
      }
    },
    {
      type: "group",
      title: "Projects",
      open: true,
      children: [
        {
          type: "ProjectList",
          title: "Project List"
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
          init: () => {
            return settings.get("exp_amount");
          },
          onUpdate: (v, s, f) => {
            settings.set("exp_amount", v.value);
          }
        },
        {
          type: "Checkbox",
          title: "use random seed",
          init: () => {
            return settings.get("exp_useRandomSeed");
          },
          onUpdate: v => {
            settings.set("exp_useRandomSeed", v.enabled);
          }
        },
        {
          type: "Number",
          title: "seed",
          min: 0,
          max: 100000,
          default: getSeed(settings.get("exp_seed")),
          init: function() {
            if (settings.get("exp_useRandomSeed")) {
              this.enabled = false;
              const s = Math.floor(Math.random() * 100000);
              this.element.value = s;
              return s;
            } else {
              this.enabled = true;
              return settings.get("exp_seed");
            }
          },
          onUpdate: v => {
            settings.set("exp_seed", v.value);
          }
        },
        {
          type: "Button",
          title: "download models",
          onClick: () => {}
        }
      ]
    }
  ]
};

const settingsConfig: UIConfig = {
  title: "settings",
  type: "stage",
  children: [
    {
      type: "Checkbox",
      title: "use random seed",
      init: () => {
        return settings.get("useRandomSeed");
      },
      onUpdate: v => {
        settings.set("useRandomSeed", v.enabled);
      }
    },
    {
      type: "Number",
      title: "seed",
      min: 0,
      max: 100000,
      default: getSeed(settings.get("seed")),
      init: function() {
        if (settings.get("useRandomSeed")) {
          this.enabled = false;
          const s = Math.floor(Math.random() * 100000);
          this.element.value = s;
          return s;
        } else {
          this.enabled = true;
          return settings.get("seed");
        }
      },
      onUpdate: v => {
        settings.set("seed", v.value);
      }
    },
    {
      type: "group",
      title: "Resolution",
      children: [
        {
          type: "Number",
          title: "Stem X Resolution",
          min: 3,
          max: 24,
          default: settings.get("stemResX"),
          onUpdate: v => {
            settings.set("stemResX", v.value);
          }
        },
        {
          type: "Number",
          title: "Stem Y Resolution",
          min: 3,
          max: 32,
          default: settings.get("stemResY"),
          onUpdate: v => {
            settings.set("stemResY", v.value);
          }
        }
      ]
    }
  ]
};

export { stemConfig, branchConfig, leafConfig, IOConfig, settingsConfig };
