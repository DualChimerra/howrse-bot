import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import { join } from 'node:path'
import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs'
import { loadGlobalSettings } from '../src/main/storage/XmlHelper'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let useTray = true

function getPreloadPath() {
  return join(__dirname, '../preload/index.js')
}

function getRendererEntry() {
  // electron-vite sets this in dev
  return process.env['ELECTRON_RENDERER_URL']
}

function getIndexHtml() {
  return join(__dirname, '../renderer/index.html')
}

function ensureUserSettingsFromResources() {
  try {
    const userSettings = join(app.getPath('userData'), 'settings')
    if (!existsSync(userSettings)) mkdirSync(userSettings, { recursive: true })
    const hasAny = readdirSync(userSettings).length > 0
    if (!hasAny) {
      const resSettings = join(process.resourcesPath, 'settings')
      if (existsSync(resSettings)) {
        for (const f of readdirSync(resSettings)) {
          copyFileSync(join(resSettings, f), join(userSettings, f))
        }
      }
      const devSettings = join(process.cwd(), 'settings')
      if (!existsSync(resSettings) && existsSync(devSettings)) {
        for (const f of readdirSync(devSettings)) {
          copyFileSync(join(devSettings, f), join(userSettings, f))
        }
      }
    }
  } catch {
    // ignore
  }
}

async function createWindow() {
  ensureUserSettingsFromResources()
  try {
    const gs: any = await loadGlobalSettings()
    if (typeof gs?.Tray === 'boolean') useTray = gs.Tray
  } catch {}

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    show: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: getPreloadPath(),
    },
  })

  mainWindow.on('close', (e) => {
    if (useTray && process.platform === 'darwin') {
      e.preventDefault()
      mainWindow?.hide()
    }
  })

  const url = getRendererEntry()
  if (url) await mainWindow.loadURL(url)
  else await mainWindow.loadFile(getIndexHtml())

  setupTray()
}

function setupTray() {
  try {
    const iconPath = join(process.resourcesPath, 'resources', 'startlogo.png')
    const icon = existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : nativeImage.createEmpty()
    tray = new Tray(icon)
    const menu = Menu.buildFromTemplate([
      { label: 'Show/Hide', click: () => { if (!mainWindow) return; mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show() } },
      { type: 'separator' },
      { label: 'Quit', click: () => { useTray = false; app.quit() } },
    ])
    tray.setToolTip('Howrse Bot')
    tray.setContextMenu(menu)
    tray.on('click', () => { if (!mainWindow) return; mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show() })
  } catch {
    // ignore tray errors
  }
}

app.whenReady().then(() => {
  // Register IPC handlers in main process
  require('../src/main/index')
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})