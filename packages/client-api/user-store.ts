import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { getUserInfo } from './user-wrapper';

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

    getUserInfo().then((u) => {
      console.log({ u })
    }).catch(err => {
      console.log({ err })
    })

  } catch (err) {
    //
  }
}


const user: Writable<User> = writable(_user);

user.subscribe(v => storage.setItem("user", JSON.stringify(v)))

export const userStore = user;
