const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    }
  });

  // In dev, load the vite dev server. In prod, load the built index.html
  const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:8080';
  const fallbackDevUrl = 'http://localhost:5173';

  if (isDev) {
    // Try primary dev URL, otherwise fallback
    win.loadURL(devUrl).catch(() => win.loadURL(fallbackDevUrl));
    win.webContents.openDevTools({ mode: 'right' });
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  win.on('closed', () => {
    // Dereference the window object
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Simple dialog on uncaught exceptions so user sees build problems
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in Electron main:', err);
  try { dialog.showErrorBox('Electron error', err?.message || String(err)); } catch (e) {}
});