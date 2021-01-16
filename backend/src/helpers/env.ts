const get = (key: string, def: unknown) => {
  return key in process.env ? process.env[key] : def;
};

export { get };
