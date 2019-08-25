let nextStage: Stage;

export default {
  title: "Importer",
  set pd(_pd: plantDescription) {
    console.log(_pd);

    nextStage.pd = _pd;
  },
  connect: (stage: Stage) => {
    nextStage = stage;
  }
};
