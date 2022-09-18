import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("xlsx_handler", {
  isDev: process.env.ELECTRON_NODE_ENV === "dev",
  getFileName: () => ipcRenderer.invoke("getFileName"),
  getDirName: () => ipcRenderer.invoke("getDirName"),
  alert: (message: string) => ipcRenderer.invoke("alert", message),
  xlsxHandler: (...args: string[]) =>
    ipcRenderer.invoke("xlsxHandler", ...args),
});
