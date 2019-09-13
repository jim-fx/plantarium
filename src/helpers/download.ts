import FileSaver from "file-saver";

//Download
const download = function(
  data: any,
  name: string,
  mimetype: string,
  extension: string
) {
  var blob = new Blob([data], { type: mimetype + ";charset=utf-8" });
  FileSaver.saveAs(blob, name + "." + extension);
};

export function json(data: any = {}, name: string = "default") {
  download(JSON.stringify(data), name, "application/json", "json");
}

export function obj(data: string, name: string = "default") {
  download(data, name, "text/plain", "obj");
}
