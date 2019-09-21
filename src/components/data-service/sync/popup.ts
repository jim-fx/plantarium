export default function(msg: string, type: string = "info") {
  postMessage({
    type: "overlay",
    value: {
      msg: msg,
      type: type
    }
  });
}
