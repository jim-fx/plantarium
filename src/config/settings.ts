import settings from "../components/settings";
import getSeed from "./_getSeed";
import logger from "../logger";
import devSettings from "../assets/devSettings.json";

const log: log = logger("config");

export default {
  title: "settings",
  type: "stage",
  children: [
    {
      type: "Checkbox",
      title: "use random seed",
      init: () => {
        return settings.get("useRandomSeed");
      },
      onUpdate: (v: parameter) => {
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
      onUpdate: (v: parameter) => {
        settings.set("seed", v.value);
      }
    },
    {
      type: "Button",
      title: "load dev settings",
      onClick: () => settings.loadSettings(devSettings)
    },
    {
      type: "Group",
      title: "Resolution",
      children: [
        {
          type: "Number",
          title: "Stem X Resolution",
          min: 3,
          max: 32,
          default: settings.get("stemResX") || 3,
          onUpdate: (v: parameter) => {
            settings.set("stemResX", v.value);
          }
        },
        {
          type: "Number",
          title: "Stem Y Resolution",
          min: 3,
          max: 32,
          default: settings.get("stemResY") || 20,
          onUpdate: (v: parameter) => {
            settings.set("stemResY", v.value);
          }
        },
        {
          type: "Number",
          title: "Leaf X Resolution",
          min: 3,
          max: 32,
          default: settings.get("leafResX") || 3,
          onUpdate: (v: parameter) => {
            settings.set("leafResX", v.value);
          }
        },
        {
          type: "Number",
          title: "Leaf Y Resolution",
          min: 3,
          max: 32,
          default: settings.get("leafResY") || 3,
          onUpdate: (v: parameter) => {
            settings.set("leafResY", v.value);
          }
        }
      ]
    },
    {
      type: "Group",
      title: "Debug",
      children: [
        {
          type: "Checkbox",
          title: "Show Indices",
          default: settings.get("debug_indices"),
          onUpdate: (v: parameter) => {
            settings.set("debug_indices", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Wireframe",
          default: settings.get("debug_wireframe"),
          onUpdate: (v: parameter) => {
            settings.set("debug_wireframe", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Generate Perf",
          default: settings.get("debug_generate_perf"),
          onUpdate: (v: parameter) => {
            settings.set("debug_generate_perf", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Render Perf",
          default: settings.get("debug_render_perf"),
          onUpdate: (v: parameter) => {
            settings.set("debug_render_perf", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Show PD",
          default: settings.get("debug_pd"),
          onUpdate: (v: parameter) => {
            settings.set("debug_pd", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Show Skeleton",
          default: settings.get("debug_skeleton"),
          onUpdate: (v: parameter) => {
            settings.set("debug_skeleton", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Disable Ground",
          default: settings.get("debug_disable_ground"),
          onUpdate: (v: parameter) => {
            settings.set("debug_disable_ground", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Disable Model",
          default: settings.get("debug_disable_model"),
          onUpdate: (v: parameter) => {
            settings.set("debug_disable_model", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Show UV",
          default: settings.get("debug_uv"),
          onUpdate: (v: parameter) => {
            settings.set("debug_uv", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Show Grid",
          default: settings.get("debug_grid"),
          onUpdate: (v: parameter) => {
            settings.set("debug_grid", v.enabled);
          }
        },
        {
          type: "Group",
          title: "Grid Settings",
          children: [
            {
              type: "Number",
              title: "Resolution",
              min: 3,
              max: 32,
              init: function() {
                if (settings.get("debug_grid")) {
                  this.enabled = true;
                } else {
                  this.enabled = false;
                }

                return settings.get("debug_grid_resolution");
              },
              onUpdate: (v: parameter) => {
                settings.set("debug_grid_resolution", v.value);
              }
            },
            {
              type: "Slider",
              title: "Size",
              min: 2,
              max: 10,
              default: 2,
              init: function() {
                if (settings.get("debug_grid")) {
                  this.enabled = true;
                } else {
                  this.enabled = false;
                }

                return settings.get("debug_grid_size") || 2;
              },
              onUpdate: (v: parameter) => {
                settings.set("debug_grid_size", v.value);
              }
            }
          ]
        },
        {
          type: "Number",
          title: "Log Level",
          min: 0,
          max: 3,
          init: function() {
            this.title.innerHTML = `${this.config.title} (${["error", "warning", "components", "all"][log.level]})`;
            return log.level;
          },
          onUpdate: function(v: parameter) {
            log.level = <number>v.value;
            this.title.innerHTML = `${this.config.title} (${["error", "warning", "components", "all"][log.level]})`;
          }
        }
      ]
    }
  ]
};
