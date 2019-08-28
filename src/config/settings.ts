import settings from "../components/settings";
import getSeed from "./_getSeed";

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
    }
  ]
};
