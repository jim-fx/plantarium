import { extname } from "path";
import { createFilter } from "rollup-pluginutils";

function toDataUrl(code) {
  const mime = "image/svg+xml";
  const buffer = Buffer.from(code, "utf-8");
  const encoded = buffer.toString("base64");
  return `'data:${mime};base64,${encoded}'`;
}

const matchID = new RegExp(/id=(["'])(\\?.)*?\1/gm);
const matchDataName = new RegExp(/data-name=(["'])(\\?.)*?\1/gm);
const matchDefsTag = new RegExp(/<\s*defs[^>]*>(.*?)<\s*\/\s*defs>/gm);
const matchStyle = new RegExp(/style=(["'])(\\?.)*?\1/gm);

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export default function svg(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: "svg",

    transform(code, id) {
      if (!filter(id) || extname(id) !== ".svg") {
        return null;
      }

      const content = code.trim();
      const cleaned = code
        .replace(matchID, "")
        .replace(matchDataName, "")
        .replace(matchDefsTag, "")
        .replaceAll(matchStyle, "")
        .replaceAll("<path", "<path vector-effect='non-scaling-stroke'")
        .replaceAll("<line", "<line vector-effect='non-scaling-stroke'")
        .replaceAll("<circle", "<circle vector-effect='non-scaling-stroke'")
        .replaceAll("<polygon", "<polygon vector-effect='non-scaling-stroke'");

      const encoded = options.base64 ? toDataUrl(cleaned) : JSON.stringify(cleaned);

      return { code: `export default ${encoded}`, map: { mappings: "" } };
    }
  };
}
