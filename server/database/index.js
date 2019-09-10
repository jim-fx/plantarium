const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(__dirname + "/data.json");
const db = low(adapter);

module.exports.getPlant = function(args) {
  var id = args.id;
  return db
    .get("plants")
    .find({ id: id })
    .value();
};
module.exports.getPlants = function(args) {
  if (args.topic) {
    var topic = args.topic;
    return db
      .get("plants")
      .filter({ topic: topic })
      .value();
  } else {
    return db.get("plants").value();
  }
};
