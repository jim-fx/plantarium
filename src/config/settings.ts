import settings from "../components/settings";
import getSeed from "./_getSeed";
import logger from "../logger";

const log = logger("config");

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
    },
    {
      type: "group",
      title: "Debug",
      children: [
        {
          type: "Checkbox",
          title: "Show Indices",
          default: settings.get("debug_indices"),
          onUpdate: v => {
            settings.set("debug_indices", v.enabled);
          }
        },
        {
          type: "Checkbox",
          title: "Wireframe",
          default: settings.get("debug_wireframe"),
          onUpdate: v => {
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
          type: "Number",
          title: "Log Level",
          min: 0,
          max: 3,
          init: function() {
            this.title.innerHTML = `${this.config.title} (${["error", "warning", "components", "all"][log.level]})`;
            return log.level;
          },
          onUpdate: function(v: parameter) {
            log.level = v.value;
            this.title.innerHTML = `${this.config.title} (${["error", "warning", "components", "all"][log.level]})`;
          }
        }
      ]
    }
  ]
};
