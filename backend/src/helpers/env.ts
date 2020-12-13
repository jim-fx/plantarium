const get = (key:string, def:any) => {
  return (key in process.env) ? process.env[key]:def;
}

export {
  get
}