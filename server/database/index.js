const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const uuid = require("uuid");
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
  console.log(args);

  if (args && args.author) {
    var author = args.author;
    return db
      .get("plants")
      .filter({ author: author })
      .value();
  } else {
    return db.get("plants").value();
  }
};

module.exports.getUser = function(args) {
  if (args && args.id) {
    var id = args.id;

    console.log(
      db
        .get("users")
        .filter({ id: id })
        .value()
    );

    return db
      .get("users")
      .filter({ id: id })
      .value()[0];
  } else {
    return false;
  }
};

module.exports.createUser = function() {
  console.log("createUser");

  const user = {
    id: uuid()
  };

  db.get("users")
    .push(user)
    .write();

  return user;
};
