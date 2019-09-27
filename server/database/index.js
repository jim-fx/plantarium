const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const uuid = require("uuid");
const adapter = new FileSync(__dirname + "/data.json");
const db = low(adapter);

export function getPlant(args) {
  var id = args.id;
  return db
    .get("plants")
    .find({ id: id })
    .value();
}

export function getPlants(args) {
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
}

export function getUser(args) {
  if (args && args.id) {
    var id = args.id;
    return db
      .get("users")
      .filter({ id: id })
      .value()[0];
  } else {
    return false;
  }
}

export function createUser() {
  const user = {
    id: uuid()
  };

  db.get("users")
    .push(user)
    .write();

  return user;
}

export function getUpdatedPlants(args) {
  const { author } = args;

  const allPlants = db.get("plants").filter({
    meta: {
      author: author
    }
  });

  console.log(args);
}
