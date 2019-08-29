let nextStage: Stage;

export default {
  title: "Importer",
  init: (_pd: plantDescription) => {
    //we need to make a deep copy;
    //or not, shallow copy seems to work fine
    nextStage.init(_pd);
  },
  connect: (stage: Stage) => {
    nextStage = stage;
  }
};
