const store =
  'store' in localStorage ? JSON.parse(localStorage.getItem('store')) : {};
save();

function save() {
  localStorage.setItem('store', JSON.stringify(store));
}

export function set(key, value) {
  store[key] = value;
  save();
}

export function get(key, defaultValue) {
  if (key in store) {
    return store[key];
  }

  store[key] = defaultValue;
  save();
  return defaultValue;
}

export default { get, set };
