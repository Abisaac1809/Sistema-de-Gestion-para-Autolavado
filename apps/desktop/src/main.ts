import { app, BrowserWindow } from 'electron'
import path from 'path'

const DEV_URL = 'http://localhost:5173'
const PROD_FILE = path.join(__dirname, '../../web/dist/index.html')

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })
    win.loadURL(DEV_URL)
    // win.loadFile(PROD_FILE)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
