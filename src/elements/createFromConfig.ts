import * as elements from "./index";
import logger from "../components/logger";
import UIElement from "./element";
const log = logger("create elements from config");

function loopThroughChildren(
  stage: Stage,
  wrapper: HTMLElement,
  config: UIConfig
): UIElement[] {
  const array: UIElement[] = [];

  if (typeof config.children === "object") {
    config.children.forEach(child => {
      //If child is a group, create it and loop again
      if (child.type === "Group") {
        const group = new elements.Group(wrapper, child);
        if ("children" in child) {
          array.push(...loopThroughChildren(stage, group.wrapper, child));
        }
        //If the child is a UIElement, create it
      } else if (child.type in elements) {
        //@ts-ignore
        array.push(new elements[child.type](stage, wrapper, child));
      } else {
        log.error("can't create nonexistent element " + child.type);
      }
    });
  }

  return array;
}

export default function createFromConfig(stage: Stage): UIElement[] {
  return loopThroughChildren(stage, stage.wrapper, stage.config);
}
