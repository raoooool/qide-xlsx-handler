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
  hash: true,
  headScripts: [
    `var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?d28849661600c3941633ed466d1e6a65";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();`,
  ],
});
