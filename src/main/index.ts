import { ipcMain, BrowserWindow } from 'electron'
import { loadAccounts, saveAccounts, loadGlobalSettings, saveGlobalSettings } from './storage/XmlHelper'
import { getClientFactory } from './http/IClient'
import { AccountLogic } from './logic/Account'
import { serverBaseUrls } from '@common/converters'
import type { Account, GlobalSettings, Settings } from '@common/types'
import { ProductType, WorkType, ClientType, Server } from '@common/enums'
import { Farm } from './logic/Farm'

// In-memory state reflecting WPF MainViewModel
const state = {
  accounts: [] as Account[],
  selectedAccountIndex: -1,
  globalSettings: null as GlobalSettings | null,
  notifications: [] as string[],
  status: '',
  version: '',
  runningCount: 0,
  doneCount: 0,
  globalIsRunning: false,
}

function getSelectedAccount(): Account | null {
  if (state.selectedAccountIndex < 0) return null
  return state.accounts[state.selectedAccountIndex] || null
}

function notify(win: BrowserWindow | null, channel: string, payload: any) {
  if (!win) return
  win.webContents.send(channel, payload)
}

// Helpers mapping Account (DTO) -> AccountLogic (runtime)
function toLogic(acc: Account): AccountLogic {
  const logic = new AccountLogic(acc.Login, acc.Password, acc.Server, acc.Settings!)
  const proxy = acc.ProxyIP ? `http://${acc.ProxyLogin && acc.ProxyPassword ? `${acc.ProxyLogin}:${acc.ProxyPassword}@` : ''}${acc.ProxyIP}` : undefined
  logic.initClient(getClientFactory(), acc.Settings ? (state.globalSettings?.ClientType ?? ClientType.New) : ClientType.New, proxy)
  logic.initProducts()
  return logic
}

// IPC: state management
ipcMain.handle('state:init', async () => {
  const [accs, globals] = await Promise.all([loadAccounts(), loadGlobalSettings()])
  state.accounts = (accs as Account[])
  state.globalSettings = globals as GlobalSettings
  state.selectedAccountIndex = state.accounts.length > 0 ? 0 : -1
  return { accounts: state.accounts, globalSettings: state.globalSettings, selected: state.selectedAccountIndex }
})

ipcMain.handle('state:get', async () => ({
  accounts: state.accounts,
  globalSettings: state.globalSettings,
  selected: state.selectedAccountIndex,
  status: state.status,
  runningCount: state.runningCount,
  doneCount: state.doneCount,
  notifications: state.notifications,
}))

ipcMain.handle('state:selectAccount', async (_e, idx: number) => { state.selectedAccountIndex = idx; return true })

ipcMain.handle('accounts:add', async (_e, acc: Account) => {
  state.accounts.push(acc)
  await saveAccounts(state.accounts)
  return true
})

ipcMain.handle('accounts:removeSelected', async () => {
  if (state.selectedAccountIndex < 0) return false
  state.accounts.splice(state.selectedAccountIndex, 1)
  state.selectedAccountIndex = Math.min(state.selectedAccountIndex, state.accounts.length - 1)
  await saveAccounts(state.accounts)
  return true
})

ipcMain.handle('accounts:saveAll', async () => { await saveAccounts(state.accounts); return true })
ipcMain.handle('accounts:loadAll', async () => { state.accounts = await loadAccounts() as Account[]; return state.accounts })

ipcMain.handle('settings:open', async () => true)
ipcMain.handle('settings:apply', async (_e, settings: Settings, scope: 'global'|'single') => {
  if (scope === 'global') {
    if (!state.globalSettings) return false
    state.globalSettings.Settings = settings
    for (const acc of state.accounts) acc.Settings = settings
    await saveGlobalSettings(state.globalSettings)
  } else {
    const sel = getSelectedAccount(); if (!sel) return false
    sel.PrivateSettings = settings
    sel.Settings = settings
    await saveAccounts(state.accounts)
  }
  return true
})

ipcMain.handle('login:normal', async (_e, idx: number, load: boolean) => {
  const acc = state.accounts[idx]
  const logic = toLogic(acc)
  const ok = await logic.loginNormal(load)
  if (ok) {
    acc.Equ = logic.equ
    acc.Pass = logic.passCount
  }
  return ok
})

ipcMain.handle('login:co', async (_e, idx: number, loginCo: string, load: boolean) => {
  const acc = state.accounts[idx]
  const logic = toLogic(acc)
  const ok = await logic.loginCo(loginCo, load)
  return ok
})

ipcMain.handle('farms:load', async (_e, idx: number) => {
  const acc = state.accounts[idx]
  const logic = toLogic(acc)
  // list of farms mirrors C# Account.LoadFarms
  const html = await logic.client.get('/elevage/chevaux/?elevage=all-horses')
  const { parseDocument } = await import('./logic/Parser')
  const $ = parseDocument(html)
  const tabs = $('.tab-action-select')
  const farms: { Name: string; Id: string }[] = []
  tabs.each((_, el) => {
    const id = $(el).attr('id') || ''
    const alt = $(el).attr('alt') || ''
    if (id === 'new-breeding' || alt === '+') return
    if (!id) farms.push({ Name: $(el).text().trim(), Id: '' })
    else farms.push({ Name: $(el).text().trim(), Id: id.split('-')[2] })
  })
  return farms
})

ipcMain.handle('work:startSingle', async (e, idx: number) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  const acc = state.accounts[idx]
  const logic = toLogic(acc)
  // Build farms from queued IDs
  const farms = (acc.FarmsQueue || []).map(fid => new Farm('', fid, logic))
  // Or if empty, treat as all-horses tab for demonstration
  if (farms.length === 0) farms.push(new Farm('all', '', logic))

  state.runningCount++
  notify(win, 'status:update', { runningCount: state.runningCount })

  const controller = new AbortController()
  try {
    for (const farm of farms) {
      await farm.run(state.globalSettings!, controller.signal)
    }
    state.doneCount++
    notify(win, 'status:update', { doneCount: state.doneCount })
  } catch (err) {
    // send notification
    state.notifications.push(`Error: ${String(err)}`)
    notify(win, 'notify', { text: state.notifications[state.notifications.length - 1] })
  } finally {
    state.runningCount = Math.max(0, state.runningCount - 1)
    notify(win, 'status:update', { runningCount: state.runningCount })
  }
  return true
})

ipcMain.handle('work:stopAll', async () => {
  // For simplicity, rely on per-run AbortController stored per request in future
  state.globalIsRunning = false
  return true
})