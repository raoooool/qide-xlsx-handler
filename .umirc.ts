import { defineConfig } from "umi";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  npmClient: "yarn",
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
  title: "表格映射小助手",
  copy: ["icon.svg"],
  favicons: ["/icon.svg"],
  base: isDev ? "/" : "/qide-xlsx-handler/",
  publicPath: isDev ? "/" : "/qide-xlsx-handler/",
});
