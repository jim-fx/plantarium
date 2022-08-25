import type { User } from "@plantarium/backend";
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { getBrowser } from "./helper";
import { getUserInfo } from './user-wrapper';

const browser = getBrowser()

let token = browser && localStorage.getItem('token');

let _user: User | null;
let _permissions = []

const storage = (() => {
  if ("sessionStorage" in globalThis)
    return globalThis["sessionStorage"]

  const sto = {
    getItem: () => undefined,
    setItem: (k: string, v: unknown) => {
      sto[k] = v;
    },
  }
  return sto;

})()

if ("user" in storage) {
  try {
    _user = JSON.parse(storage.getItem("user"));
  } catch (err) {
  }
}


if ("permissions" in storage) {
  try {
    _permissions = JSON.parse(storage.getItem("permissions"));
  } catch (err) {
    console.error(err)
  }
}


const user: Writable<User | null> = writable(_user);

const isLoggedIn: Writable<boolean> = writable(_user && "_id" in _user);

user.subscribe(v => {
  isLoggedIn.set(v && "_id" in v);
  storage.setItem("user", v ? JSON.stringify(v) : null)
})

globalThis["loggedIn"] = isLoggedIn;

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
      user.set(null)
    } else {
      getUserInfo().then(res => {
        if (res.ok) {
          user.set(res.data);
        } else {
          user.set(null)
        }
      })
    }
  },
  get token() {
    return token;
  }
};
