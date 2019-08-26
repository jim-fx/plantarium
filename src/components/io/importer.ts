let nextStage: Stage;

export default {
  title: "Importer",
  init: (_pd: plantDescription) => {
    //we need to make a deep copy;
    nextStage.init(JSON.parse(JSON.stringify(_pd)));
  },
  connect: (stage: Stage) => {
    nextStage = stage;
  }
};
