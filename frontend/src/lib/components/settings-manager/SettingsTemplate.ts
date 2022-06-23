import type { ValueTemplate as _ValueTemplate } from "@plantarium/ui";

type ValueTemplate = _ValueTemplate & { label?: string }

type Settings = { options: { [key: string]: ValueTemplate }, onlyDev?: boolean };
export type MainSettings = { [key: string]: (ValueTemplate | Settings) };


type Settings2Type<T extends MainSettings | Settings> = {
  [K in keyof T]:
  T[K] extends ValueTemplate ? T[K]["value"]
  : T[K] extends Settings ? Settings2Type<T[K]["options"]>
  : T[K] extends MainSettings ? Settings2Type<T[K]>
  : unknown;
};

function settingsType<T extends MainSettings>(s: T): Settings2Type<T> {
  return s as Settings2Type<T>;
}

export default settingsType({
  useRandomSeed: {
    type: 'boolean',
    value: false
  },
  theme: {
    type: 'select',
    inputType: "tab",
    values: ['dark', 'light', 'auto'],
    value: 'auto',
  },
  debug: {
    onlyDev: true,
    options: {
      nodeTimings: {
        type: 'boolean',
        label: "Show Node Timings",
        value: false,
      },
      showNodeUpdates: {
        type: 'boolean',
        value: false
      },
      material: {
        type: "select",
        label: "Material",
        values: ["Flat", "Basic", "Debug"],
        value: "Basic"
      },
      hideMesh: {
        label: "Hide Mesh",
        type: "boolean",
        value: false
      },
      renderPerf: {
        label: "Render Performance",
        type: 'boolean',
        value: false
      },
      generatePerf: {
        label: "Generator Performance",
        type: 'boolean',
        value: false
      },
      debugVectors: {
        label: "Show Debug Vectors",
        type: "boolean",
        value: false,
      },
      pd: {
        type: 'boolean',
        label: "Show Project Data",
        value: false
      },
      skeleton: {
        type: 'boolean',
        label: "Show Skeleton",
        value: false
      },
      wireframe: {
        type: 'boolean',
        label: "Show Wireframe",
        value: false
      },
      boundingBox: {
        type: "boolean",
        label: "Show Bounding Box",
        value: false
      },
      logLevel: {
        type: 'number',
        min: 0,
        max: 2,
        value: 1
      }
    }
  },
  seed: {
    onlyDev: false,
    options: {
      value: {
        type: "number",
        value: 0
      },
      useRandom: {
        type: "boolean",
        value: false
      }
    }
  },
  background: {
    options: {
      grid: {
        label: 'Show Grid',
        type: 'boolean',
        value: false
      },
      ground: {
        label: 'Show Ground',
        type: 'boolean',
        value: true
      },
      resX: {
        onlyDev: true,
        type: 'number',
        min: 8,
        max: 64,
        step: 1,
        value: 8
      },
      resY: {
        onlyDev: true,
        type: 'number',
        min: 8,
        max: 64,
        step: 1,
        value: 16
      },
      scale: {
        type: 'number',
        min: 0,
        max: 5,
        step: 0.1,
        value: 1
      }
    }
  },
  leafRes: {
    label: "Leaf Resolution",
    type: 'number',
    min: 3,
    max: 12,
    step: 1,
    value: 2
  },
  stemResX: {
    label: "Stem Resolution",
    type: 'number',
    min: 3,
    max: 32,
    step: 1,
    value: 3
  },
  stemResY: {
    onlyDev: true,
    label: "Stem Resolution Y",
    type: 'number',
    min: 3,
    max: 64,
    step: 1,
    value: 32
  },
  isDev: {
    label: 'Advanced',
    type: 'boolean',
    value: false
  }
});

