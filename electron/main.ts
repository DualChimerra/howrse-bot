import { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, shell } from 'electron'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format } from 'node:url'
import { existsSync } from 'node:fs'
import { loadAccounts, loadGlobalSettings, saveAccounts, saveGlobalSettings } from '../src/main/storage/XmlHelper.js'
import { getClientFactory } from '../src/main/http/IClient.js'

const isMac = process.platform === 'darwin'
const __dirname2 = fileURLToPath(new URL('.', import.meta.url))

let win: BrowserWindow | null = null
let tray: Tray | null = null

function getPreloadPath() {
  const dev = join(__dirname2, '../dist/preload/index.js')
  const src = join(__dirname2, 'preload.ts')
  return existsSync(dev) ? dev : src
}

function getRendererUrl() {
  // dev server
  const devUrl = process.env.ELECTRON_RENDERER_URL
  if (devUrl) return devUrl
  // production file
  return format({
    pathname: join(__dirname2, '../dist/renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  })
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#1f2023',
    frame: false,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 14 },
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      spellcheck: false,
      devTools: true
    }
  })

  const url = getRendererUrl()
  if (url.startsWith('file:')) {
    await win.loadURL(url)
  } else {
    await win.loadURL(url)
  }

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  setupMenu()
  setupTray()
}

function setupMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac ? [{ role: 'appMenu' as const }] : []),
    {
      label: 'Window',
      submenu: [
        { label: 'Show', click: () => win?.show() },
        { label: 'Hide', click: () => win?.hide() },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    { role: 'editMenu' as const },
    { role: 'viewMenu' as const }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function setupTray() {
  try {
    const iconPath = resolve(process.cwd(), 'BotQually/Resources/startlogo.png')
    const icon = nativeImage.createFromPath(iconPath)
    tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon)
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show', click: () => win?.show() },
      { label: 'Hide', click: () => win?.hide() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ])
    tray.setToolTip('Howrse Bot')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
      if (!win) return
      if (win.isVisible()) win.hide(); else win.show()
    })
  } catch {}
}

// IPC: storage
ipcMain.handle('storage:loadAccounts', async () => loadAccounts())
ipcMain.handle('storage:saveAccounts', async (_e, accounts) => saveAccounts(accounts))
ipcMain.handle('storage:loadGlobalSettings', async () => loadGlobalSettings())
ipcMain.handle('storage:saveGlobalSettings', async (_e, settings) => saveGlobalSettings(settings))

// IPC: http client factory usage, no network from renderer
ipcMain.handle('http:request', async (_e, args: { baseUrl: string, proxy?: string, clientType: 'new'|'old', method: 'GET'|'POST', url: string, data?: string }) => {
  const { baseUrl, proxy, clientType, method, url, data } = args
  const client = await getClientFactory()(clientType, baseUrl, proxy)
  if (method === 'GET') return client.get(url)
  return client.post(url, data ?? '')
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})