import { get, set } from "idb-keyval";
import graph from "./graph";

const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

let enabled: boolean = false;
let id: string;

get("sync_enabled").then(val => {
  enabled = !!val;
});

get("sync_id").then(val => {
  id = <string>val;
});

export default {
  getID: async () => {
    if (id) {
      return id;
    } else {
      const { user } = await graph(`
          {
            user {
              id
            }
          }
        `);

      id = user.id;

      set("sync_id", id);

      postMessage({ type: "overlay", value: { type: "success", msg: `created new user` } });

      return id;
    }
  },
  setID: async (_id: string) => {
    if (_id !== id) {
      if (regex.exec(_id)) {
        const res = await graph.getUser({ id: _id });

        console.log(res);

        id = _id;
        set("sync_id", id);
        return true;
      } else {
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
