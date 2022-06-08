import * as _steps from "./steps";
import store from "./store";
import { localState } from "$lib/helpers"

const steps = Object.values(_steps);

type StepValue = (ReturnType<typeof steps[number]> extends Promise ? Awaited<ReturnType<typeof steps[number]>> : ReturnType<typeof steps[number]>) | "waiting";

class Tutor {

  private state: StepValue = "waiting";
  private steps = steps as Array<(s: StepValue) => Promise<StepValue> | StepValue>
  private isRunning = false;

  constructor() {
    this.state = localState.get("tutorial-state", "waiting");
  }

  start(s?: StepValue) {
    if (this.isRunning) return;
    this.state = s || "intro";
    localState.set("tutorial-state", this.state);
    this.run()
  }

  init() {
    if (this.state !== "exit") {
      this.run()
    }
  }

  private async run() {

    if (this.isRunning) return;
    this.isRunning = true;

    store.set(undefined)
    if (this.state === "exit") {
      this.isRunning = false;
      return;
    };

    for (const step of this.steps) {
      let res = await step(this.state);
      if (res) {
        this.state = res as StepValue;
        localState.set("tutorial-state", this.state);
        break;
      }
    }

    this.isRunning = false;
    this.run()
  }
}

export default new Tutor();
