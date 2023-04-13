import { typeCheckNode } from "../types";

export default typeCheckNode({
  title: "Scale Shape",
  outputs: ["shape"],
  type: "scale_shape",
  parameters: {
    shape: {
      type: "shape",
      external: true,
      value: [
        { x: 1, y: 0, pinned: true },
        { x: 0.5, y: 0.5, pinned: true },
        { x: 1, y: 1, pinned: true },
      ]
    },
    scale: {
      type: "vec2",
      inputType: "float",
      value: { x: 1, y: 1 },
    }
  },
  compute(params) {
    const shape = params.shape();
    return shape.map((v, i, a) => {

      const _scale = params.scale(i / a.length);

      return { x: v.x * _scale.x, y: v.y * _scale.y, pinned: v.pinned };

    });
  }
})
