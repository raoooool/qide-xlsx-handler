import { defineConfig } from "umi";

const isDev = process.env.NODE_ENV === "development";

const baseName = isDev ? "/" : "/qide-xlsx-handler/";

export default defineConfig({
  npmClient: "yarn",
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
  title: "表格映射小助手",
  copy: ["icon.svg"],
  favicons: [baseName + "icon.svg"],
  base: baseName,
  publicPath: baseName,
});
