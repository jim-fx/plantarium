import * as admin from "./admin-wrapper";
import store, { userStore } from "./store";
import * as user from "./user-wrapper";

export * from "./store"
export * from "./core"
export * from "./admin-wrapper"
export * from "./user-wrapper"

export default {
  ...admin,
  ...user,
}

user.getUserInfo().then((res) => {
  if (res.ok) {
    userStore.set(res.data)
  } else {
    store.token = undefined;
  }
}).catch(err => {
  console.error(err)
  console.log({ err })
})
