import projectManager from "../components/project-manager";
import settings from "../components/settings";
import getSeed from "./_getSeed";

export default {
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
      type: "Group",
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
      type: "Group",
      title: "Export",
      children: [
        {
          type: "Number",
          title: "amount",
          default: 10,
          init: () => {
            return settings.get("exp_amount");
          },
          onUpdate: (v: parameter) => {
            settings.set("exp_amount", v.value);
          }
        },
        {
          type: "Checkbox",
          title: "use random seed",
          init: () => {
            return settings.get("exp_useRandomSeed");
          },
          onUpdate: (v: parameter) => {
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
          onUpdate: (v: parameter) => {
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
