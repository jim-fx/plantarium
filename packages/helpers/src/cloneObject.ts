const fallback = (o: unknown) => JSON.parse(JSON.stringify(o));
export const cloneObject = (globalThis["structuredClone"] || fallback) as <T>(o: T) => T;
