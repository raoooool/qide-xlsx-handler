const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("global", {
  isDev: process.env.ELECTRON_NODE_ENV === "dev",
});
