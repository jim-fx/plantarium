const pd: plantDescription = {
  meta: {
    name: "default",
    author: "jimfx"
  },
  stem: {
    diameter: {
      value: 0.2
    },
    height: {
      value: 1
    },
    amount: {
      value: 1
    }
  },
  branches: {
    diameter: {
      value: 1
    }
  },
  leaves: {
    diameter: {
      value: 1
    },
    size: {
      value: 1
    },
    shape: [{ x: 0, y: 0 }, { x: 0.3, y: 0.4 }, { x: 0.3, y: 0.6 }, { x: 0, y: 1 }]
  }
};

export default pd;
