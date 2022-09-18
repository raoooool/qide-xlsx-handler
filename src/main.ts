import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import { dialog } from "electron";
import xlsxHandler from "./xlsxHandler";

const isDev = process.env.ELECTRON_NODE_ENV === "dev";

function createWindow() {
  const win = new BrowserWindow({
    // width: 1280,
    // height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:8000");
    win.webContents.openDevTools({ mode: "bottom" });
  } else {
    win.loadFile(path.join(__dirname, "..", "web", "dist", "index.html"));
  }

  // 业务逻辑
  function getFileName() {
    const result = dialog.showOpenDialogSync({
      properties: ["openFile"],
      filters: [{ name: "xlsx", extensions: ["xlsx"] }],
    });
    return result?.[0];
  }
  function getDirName() {
    const result = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    return result?.[0];
  }
  function alert(message: string) {
    dialog.showMessageBoxSync({ type: "info", message });
  }

  ipcMain.handle("getFileName", getFileName);
  ipcMain.handle("getDirName", getDirName);
  ipcMain.handle("alert", (e, message: string) => alert(message));
  ipcMain.handle("xlsxHandler", (e, ...args) => xlsxHandler(...args));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
