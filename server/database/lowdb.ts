import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import uuid from "uuid";
import id from "shortid";

const adapter = new FileSync(__dirname + "/data.json");
const db = low(adapter);

export function getPlant(args) {
  var id = args.id;
  return db
    .get("plants")
    .find({ id: id })
    .value();
}

export function updatePlant(p: plantDescription): plantMetaInfo {
  if (p.meta.id) {
    const curPlant = db
      .get("plants")
      .find({ meta: { id: p.meta.id } })
      .value();

    if (curPlant) {
      db.get("plants")
        .find({ meta: { id: p.meta.id } })
        .assign(p)
        .write();
    } else {
      console.log("ADD PLANT");

      db.get("plants")
        .push(p)
        .write();
    }
  } else {
    p.meta.id = id();

    db.get("plants")
      .push(p)
      .write();
  }

  return p.meta;
}

export function deletePlant() {}

export function getPlants(args: { author: String }): plantDescription[] {
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
