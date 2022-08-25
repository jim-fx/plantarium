import * as admin from "./admin-wrapper";
import * as core from "./core";
import store, { userStore } from "./store";
import * as user from "./user-wrapper";

export * from "./admin-wrapper";
export * from "./core";
export * from "./store";
export * from "./user-wrapper";

export default {
  ...admin,
  ...user,
}

globalThis["capi"] = {
  ...admin,
  ...user,
  core
}

user.getUserInfo().then((res) => {
  if (res.ok) {
    userStore.set(res.data)
  } else {
    store.token = undefined;
  }
})
