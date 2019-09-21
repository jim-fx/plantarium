import { get, set } from "idb-keyval";
import graph from "./graph";
import popup from "./popup";

const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

let enabled: boolean = false;
let id: string;
let initialized = false;

async function init() {
  const e = await get("sync_enabled");
  enabled = !!e;

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
    }
  }
};
