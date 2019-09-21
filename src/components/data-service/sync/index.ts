import { get, set } from "idb-keyval";
import graph from "./graph";
import popup from "./popup";
import db from "../localStores/indexedDB";
import interval from "../../../helpers/interval";

const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

let enabled: boolean = false;
let id: string;
let initialized = false;

async function sync() {
  const m = (await db.getPlantMetas()).map((d: plantMetaInfo) => {
    return {
      name: d.name,
      lastSaved: d.lastSaved
    };
  });

  graph
    .getUpdatedPlants(id, m)
    .then(newM => {
      console.log(newM);
      popup("synced data", "sync");
    })
    .catch(err => {
      popup("sync " + err, "error");
    });
}
const int = interval(sync, 10000);

async function init() {
  const e = await get("sync_enabled");
  enabled = !!e;

  if (enabled) {
    int.start();
    sync();
  } else {
    int.stop();
  }

  const i = await get("sync_id");
  id = <string>i;

  initialized = true;
}
init();

export default {
  getID: async () => {
    if (!initialized) await init();

    if (id) {
      return id;
    } else {
      const { user } = await graph.createUser();

      id = user.id;

      set("sync_id", id);

      popup("created new user", "success");

      return id;
    }
  },
  setID: async (_id: string) => {
    if (!initialized) await init();

    if (_id && _id !== id && regex.exec(_id)) {
      const { user } = await graph.getUser({ id: _id });

      if (user && user.id) {
        id = user.id;
        set("sync_id", user.id);
        popup("logged in", "success");
        return user.id;
      } else {
        popup("could not log in", "error");
        return id;
      }
    } else {
      return id;
    }
  },
  get enabled(): boolean {
    return enabled;
  },
  set enabled(v: boolean) {
    if (enabled !== v) {
      enabled = v;
      set("sync_enabled", v);
      popup(`sync ${v ? "en" : "dis"}abled`, "success");
      if (v) {
        sync();
        int.start();
      } else {
        int.stop();
      }
    }
  }
};
