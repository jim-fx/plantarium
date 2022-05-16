// Adapted slightly from Sam Dutton
// Set name of hidden property and visibility change event
// since some browsers only offer vendor-prefixed support
let state: string, visibilityChange: string;

if (globalThis["document"]) {
  if (typeof document["hidden"] !== "undefined") {
    visibilityChange = "visibilitychange";
    state = "visibilityState";
  } else if (typeof document["mozHidden"] !== "undefined") {
    visibilityChange = "mozvisibilitychange";
    state = "mozVisibilityState";
  } else if (typeof document["msHidden"] !== "undefined") {
    visibilityChange = "msvisibilitychange";
    state = "msVisibilityState";
  } else if (typeof document["webkitHidden"] !== "undefined") {
    visibilityChange = "webkitvisibilitychange";
    state = "webkitVisibilityState";
  }
}


export default (cb: (visible: boolean) => unknown) => {
  if (globalThis["document"]) {
    cb(document[state])
    // Add a listener that constantly changes the title
    document.addEventListener(visibilityChange, function() {
      cb(document[state])
    }, false);
  }

}
