import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { getBrowser, parseJwt } from "./helper"
import { getUserInfo } from './user-wrapper';

const browser = getBrowser()

let token = browser && localStorage.getItem('token');

interface User {
  username?: string;
  id?: string;
  role?: string;
  permissions?: string[];
}

let _user = {};

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


const user: Writable<User> = writable(_user);

user.subscribe(v => {
  console.log("UserStore", { v })
  storage.setItem("user", JSON.stringify(v))
})

export const userStore = user;

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
