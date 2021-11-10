import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

interface User {
	username?: string;
	id?: string;
  role?: string;
  permissions?: string[];
}

let _user = {};

if("user" in sessionStorage){
  try{
    _user = JSON.parse(sessionStorage.getItem("user"));
  }catch(err){
    //
  }
}


const user: Writable<User> = writable(_user);

user.subscribe(v => {
  sessionStorage.setItem("user", JSON.stringify(v));
})

export const userStore = user;
