export default {
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
