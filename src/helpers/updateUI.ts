import importer from "../components/io/importer";
import exporter from "../components/io/exporter";
export default function() {
  importer.init(exporter.pd);
}
