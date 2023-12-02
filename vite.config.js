import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [glsl(), tsconfigPaths()],
});
