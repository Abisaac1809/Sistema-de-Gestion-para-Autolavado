import { app, BrowserWindow, utilityProcess } from 'electron'
import path from 'path'
import fs from 'fs'

const DEV_URL = 'http://localhost:5173'

type ApiProcess = ReturnType<typeof utilityProcess.fork>
let apiProcess: ApiProcess | null = null

function getDbPath(): string {
  return path.join(app.getPath('userData'), 'car-wash.db')
}

function ensureDatabase(): void {
  const dbPath = getDbPath()
  if (!fs.existsSync(dbPath)) {
    const seedDb = path.join(process.resourcesPath, 'car-wash-seed.db')
    if (fs.existsSync(seedDb)) {
      fs.copyFileSync(seedDb, dbPath)
    }
  }
}

function findEngineFile(dir: string): string | undefined {
  try {
    return fs.readdirSync(dir).find(f => f.startsWith('libquery_engine') && f.endsWith('.node'))
  } catch {
    return undefined
  }
}

async function waitForAPI(maxMs = 20000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch('http://localhost:3001/api/config/store')
      if (res.status < 500) return
    } catch {}
    await new Promise(r => setTimeout(r, 400))
  }
}

async function startAPI(): Promise<void> {
  ensureDatabase()

  const resourcesPath = process.resourcesPath
  const serverPath = path.join(resourcesPath, 'server.js')
  const dbPath = getDbPath()
  const engineFile = findEngineFile(resourcesPath)

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PORT: '3001',
    DATABASE_URL: `file:${dbPath}`,
    NODE_ENV: 'production',
  }

  if (engineFile) {
    env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(resourcesPath, engineFile)
  }

  apiProcess = utilityProcess.fork(serverPath, [], { env, stdio: 'pipe' })

  await waitForAPI()
}

async function createWindow(): Promise<void> {
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

  if (app.isPackaged) {
    const webIndex = path.join(process.resourcesPath, 'web', 'index.html')
    await win.loadFile(webIndex)
  } else {
    await win.loadURL(DEV_URL)
  }
}

app.whenReady().then(async () => {
  if (app.isPackaged) {
    await startAPI()
  }
  await createWindow()
})

app.on('window-all-closed', () => {
  apiProcess?.kill()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
