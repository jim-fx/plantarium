import zig from "vite-plugin-zig"

export default {
  plugins: [zig()],
  build: { target: "esnext" }
}
