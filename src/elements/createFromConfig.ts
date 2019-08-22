import * as elements from "./index";
import logger from "../logger";

const log = logger("create elements from config");

function loopThroughChildren(
  stage: Stage,
  wrapper: HTMLElement,
  config: UIConfig
): void {
  if (typeof config.children === "object") {
    config.children.forEach(child => {
      //If child is a group, create it and loop again
      if (child.type === "group") {
        const group = new elements.Group(wrapper, child.title);
        if ("children" in child) {
          loopThroughChildren(stage, group.wrapper, child);
        }
        //If the child is a UIElement, create it
      } else if (child.type in elements) {
        //@ts-ignore
        new elements[child.type](stage, wrapper, child);
      } else {
        log.error("can't create nonexistent element " + child.type);
      }
    });
  }
}

export default function createFromConfig(stage: Stage): void {
  loopThroughChildren(stage, stage.wrapper, stage.config);
}
