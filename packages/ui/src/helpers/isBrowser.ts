function getBrowser(){
  return "window" in globalThis
}

export const isBrowser = getBrowser()
