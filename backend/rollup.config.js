
import typescript from "rollup-plugin-typescript";
import graphql from "rollup-plugin-graphql";

const server = {
  input: "./server/index.ts",
  plugins: [resolve({ extensions, preferBuiltins: true }), commonjs(), typescript(), json(), graphql()],
  external: [
    "url",
    "events",
    "path",
    "zlib",
    "http",
    "net",
    "fs",
    "buffer",
    "crypto",
    "util",
    "stream",
    "tty",
    "mongodb-client-encryption",
    "assert",
    "saslprep",
    "cluster",
    "dns",
    "constants",
    "string_decoder",
    "tls",
    "module"
  ],
  output: {
    file: "build/server/server.js",
    format: "cjs"
  }
};

export default server;