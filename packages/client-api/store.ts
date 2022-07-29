import type { User } from "@plantarium/backend";
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { getBrowser, parseJwt } from "./helper";
import { getUserInfo } from './user-wrapper';

const browser = getBrowser()

let token = browser && localStorage.getItem('token');


let _user = {};
let _permissions = []

const storage = (() => {
  if (!("sessionStorage" in globalThis)) {
    const sto = {
      getItem: (k) => undefined,
      setItem: (k, v) => {
        sto[k] = v;
      },
    }
    return sto;
  }

  return globalThis["sessionStorage"]
})()

if ("user" in storage) {
  try {
    _user = JSON.parse(storage.getItem("user"));
  } catch (err) {
    console.log("Heeere 4")
  }
}


if ("permissions" in storage) {
  try {
    _permissions = JSON.parse(storage.getItem("permissions"));
  } catch (err) {
    console.log("Heeere 4")
  }
}


const user: Writable<User | {}> = writable(_user);

const isLoggedIn: Writable<boolean> = writable(_user && "_id" in _user);

user.subscribe(v => {
  isLoggedIn.set("_id" in v);
  storage.setItem("user", JSON.stringify(v))
})

export const userStore = user;
export { isLoggedIn };
export const permissions = writable<string[]>(_permissions)
permissions.subscribe((p) => {
  storage.setItem("permissions", JSON.stringify(p))
})

export default {
  set token(v) {
    token = v;
    browser && localStorage.setItem('token', v);
    if (!token) {
      userStore.set({})
    } else {
      const parsed = parseJwt(v);
      console.log({ parsed });
      getUserInfo().then(res => {
        console.log({ res })
        if (res.ok) {
          console.log("Setting Store", res.data)
          user.set(res.data);
        } else {
        }
      })
    }
  },
  get token() {
    return token;
  }
};
