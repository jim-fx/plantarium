/// <reference types="vite/client" />


declare module "*.zig" {
  const w = WebAssembly;
  export const instantiate = (importObject?: { [key: string]: any }) => Promise<{ exports: { [key: string]: any } }>();
}
