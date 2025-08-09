import { ipcMain, BrowserWindow, app } from 'electron'
import { loadAccounts, saveAccounts, loadGlobalSettings, saveGlobalSettings, getSettingsPaths } from './storage/XmlHelper'
import { getClientFactory } from './http/IClient'
import { AccountLogic } from './logic/Account'
import { serverBaseUrls } from '@common/converters'
import type { Account, GlobalSettings, Settings } from '@common/types'
import { ProductType, WorkType, ClientType, Server } from '@common/enums'
import { Farm } from './logic/Farm'
import { Scheduler } from './logic/Scheduler'

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

const controllers = new Map<number, AbortController>()

function getSelectedAccount(): Account | null {
  if (state.selectedAccountIndex < 0) return null
  return state.accounts[state.selectedAccountIndex] || null
}

function notify(win: BrowserWindow | null, channel: string, payload: any) {
  if (!win) return
  win.webContents.send(channel, payload)
}

function notifyAll(channel: string, payload: any) {
  for (const w of BrowserWindow.getAllWindows()) {
    w.webContents.send(channel, payload)
  }
}

// IPC: window controls
ipcMain.handle('window:minimize', (e) => { const w = BrowserWindow.fromWebContents(e.sender); w?.minimize() })
ipcMain.handle('window:maximize', (e) => { const w = BrowserWindow.fromWebContents(e.sender); if (!w) return; if (w.isMaximized()) w.unmaximize(); else w.maximize() })
ipcMain.handle('window:close', (e) => { const w = BrowserWindow.fromWebContents(e.sender); w?.close() })

// IPC: state management
ipcMain.handle('state:init', async () => {
  const [accs, globals] = await Promise.all([loadAccounts(), loadGlobalSettings()])
  state.accounts = (accs as Account[])
  state.globalSettings = (globals as GlobalSettings) || { Sort: 'age', WorkType: WorkType.SingleOrder, ClientType: ClientType.New, ParallelHorse: false, RandomPause: false, Tray: true, MoneyNotification: false, Localization: 0, Settings: {} as any }
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

ipcMain.handle('accounts:saveAll', async (_e, maybeArr?: Account[]) => {
  if (Array.isArray(maybeArr)) state.accounts = maybeArr
  await saveAccounts(state.accounts); return true
})
ipcMain.handle('accounts:loadAll', async () => { state.accounts = await loadAccounts() as Account[]; return state.accounts })

// Save only selected sharing account into Accounts.xml if not exists (WPF SaveCoAccountToFile)
ipcMain.handle('accounts:saveCoSelected', async () => {
  const sel = getSelectedAccount(); if (!sel) return false
  if (sel.Type !== 1 /* AccountType.Co */) return false
  const current = await loadAccounts() as Account[]
  const exists = current.some(a => a.Login === sel.Login && a.Server === sel.Server && a.Type === sel.Type && a.LoginCo === sel.LoginCo)
  if (!exists) current.push(sel)
  await saveAccounts(current)
  return true
})

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

ipcMain.handle('settings:saveToFile', async (_e, settings: Settings) => { await saveGlobalSettings({ ...(state.globalSettings||{}), Settings: settings } as any); return true })
ipcMain.handle('settings:loadFromFile', async () => loadGlobalSettings())

ipcMain.handle('globals:update', async (_e, patch: Partial<GlobalSettings>) => {
  if (!state.globalSettings) state.globalSettings = {} as any
  state.globalSettings = { ...state.globalSettings, ...patch }
  await saveGlobalSettings(state.globalSettings)
  notifyAll('status:update', { globalSettings: state.globalSettings })
  return state.globalSettings
})

// Login
async function toLogic(acc: Account): Promise<AccountLogic> {
  const logic = new AccountLogic(acc.Login, acc.Password, acc.Server, (acc.Settings || acc.PrivateSettings) as Settings)
  const proxy = acc.ProxyIP ? `http://${acc.ProxyLogin && acc.ProxyPassword ? `${acc.ProxyLogin}:${acc.ProxyPassword}@` : ''}${acc.ProxyIP}` : undefined
  await logic.initClient(getClientFactory(), (state.globalSettings?.ClientType ?? ClientType.New) as any, proxy)
  logic.initProducts()
  return logic
}

ipcMain.handle('login:normal', async (_e, idx: number, load: boolean) => {
  const acc = state.accounts[idx]
  const logic = await toLogic(acc)
  const ok = await logic.loginNormal(load)
  if (ok) {
    acc.Equ = logic.equ
    acc.Pass = logic.passCount
    await saveAccounts(state.accounts)
  }
  return ok
})

ipcMain.handle('login:co', async (_e, idx: number, loginCo: string, load: boolean) => {
  const acc = state.accounts[idx]
  const logic = await toLogic(acc)
  const ok = await logic.loginCo(loginCo, load)
  if (ok) {
    acc.LoginCo = loginCo
    await saveAccounts(state.accounts)
  }
  return ok
})

ipcMain.handle('login:listCo', async (_e, idx: number) => {
  const acc = state.accounts[idx]
  const logic = await toLogic(acc)
  const html = await logic.client.get('/member/account/?type=sharing')
  const { parseDocument } = await import('./logic/Parser')
  const $ = parseDocument(html)
  const tables = $('.table--striped')
  const names: string[] = []
  if (tables.length >= 2) {
    const els = tables.eq(1).find('.usergroup_2')
    els.each((_, el) => names.push($(el).text().trim()))
  }
  return names
})

ipcMain.handle('login:logoutCo', async (_e, idx: number) => {
  const acc = state.accounts[idx]
  const logic = await toLogic(acc)
  try {
    await logic.client.get('/site/doLogout')
    acc.LoginCo = ''
    await saveAccounts(state.accounts)
    return true
  } catch { return false }
})

ipcMain.handle('farms:load', async (_e, idx: number) => {
  const acc = state.accounts[idx]
  const logic = await toLogic(acc)
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

ipcMain.handle('farms:addToQueue', async (_e, idx: number, farmId: string) => {
  const acc = state.accounts[idx]
  acc.FarmsQueue = acc.FarmsQueue || []
  if (!acc.FarmsQueue.includes(farmId)) acc.FarmsQueue.push(farmId)
  await saveAccounts(state.accounts)
  return true
})

ipcMain.handle('farms:removeFromQueue', async (_e, idx: number, farmId: string) => {
  const acc = state.accounts[idx]
  acc.FarmsQueue = (acc.FarmsQueue || []).filter(id => id !== farmId)
  await saveAccounts(state.accounts)
  return true
})

ipcMain.handle('farms:clearQueue', async (_e, idx: number) => {
  const acc = state.accounts[idx]
  acc.FarmsQueue = []
  await saveAccounts(state.accounts)
  return true
})

ipcMain.handle('products:buy', async (_e, idx: number, type: ProductType, quantity: string) => {
  const acc = state.accounts[idx]
  const logic = await toLogic(acc)
  await logic.loginNormal(false).catch(()=>{})
  const prod = logic.getProductByType(type)
  if (!prod) return false
  await logic.buy(prod, quantity)
  await logic.loadProducts()
  acc.Equ = logic.equ
  ;(acc as any)[ProductType[type]] = { ...(acc as any)[ProductType[type]], Amount: (prod as any).amount }
  await saveAccounts(state.accounts)
  return true
})

ipcMain.handle('products:sell', async (_e, idx: number, type: ProductType, quantity: string) => {
  const acc = state.accounts[idx]
  const logic = await toLogic(acc)
  await logic.loginNormal(false).catch(()=>{})
  const prod = logic.getProductByType(type)
  if (!prod) return false
  await logic.sell(prod, quantity)
  await logic.loadProducts()
  acc.Equ = logic.equ
  ;(acc as any)[ProductType[type]] = { ...(acc as any)[ProductType[type]], Amount: (prod as any).amount }
  await saveAccounts(state.accounts)
  return true
})

ipcMain.handle('work:startSingle', async (e, idx: number) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  const acc = state.accounts[idx]
  const logic = await toLogic(acc)
  const farms = (acc.FarmsQueue || []).map(fid => new Farm('', fid, logic))
  if (farms.length === 0) farms.push(new Farm('all', '', logic))

  const controller = new AbortController()
  controllers.set(idx, controller)

  state.runningCount++
  notify(win, 'status:update', { runningCount: state.runningCount })

  const scheduler = new Scheduler()
  try {
    const tasks = farms.map((farm) => async (signal?: AbortSignal) => {
      await farm.run(state.globalSettings!, signal || controller.signal, (kind, value) => {
        notify(win, 'status:update', { accountIndex: idx, kind, value })
      })
    })
    const mode = state.globalSettings?.WorkType ?? WorkType.SingleOrder
    const concurrency = mode === WorkType.SingleParallel ? 5 : 1
    await scheduler.run(tasks, mode, {
      concurrency,
      randomPause: !!state.globalSettings?.RandomPause,
      minPauseMs: 50,
      maxPauseMs: 100,
      signal: controller.signal,
    })
    state.doneCount++
    notify(win, 'status:update', { doneCount: state.doneCount })
  } catch (err) {
    state.notifications.push(`Error: ${String(err)}`)
    notify(win, 'notify', { text: state.notifications[state.notifications.length - 1] })
  } finally {
    controllers.delete(idx)
    state.runningCount = Math.max(0, state.runningCount - 1)
    notify(win, 'status:update', { runningCount: state.runningCount })
  }
  return true
})

ipcMain.handle('work:startAll', async (e) => {
  state.globalIsRunning = true
  const win = BrowserWindow.fromWebContents(e.sender)
  const scheduler = new Scheduler()
  try {
    const indices = state.accounts.map((_, i) => i)
    const tasks = indices.map((i) => async (signal?: AbortSignal) => {
      if (!state.globalIsRunning) return
      const acc = state.accounts[i]
      const logic = await toLogic(acc)
      const farms = (acc.FarmsQueue || []).map(fid => new Farm('', fid, logic))
      if (farms.length === 0) farms.push(new Farm('all', '', logic))
      const controller = new AbortController()
      controllers.set(i, controller)
      state.runningCount++
      notify(win, 'status:update', { runningCount: state.runningCount })
      try {
        const farmTasks = farms.map((farm) => async (sig?: AbortSignal) => farm.run(state.globalSettings!, sig || controller.signal, (kind, value) => {
          notify(win, 'status:update', { accountIndex: i, kind, value })
        }))
        const mode = state.globalSettings?.WorkType ?? WorkType.GlobalOrder
        const concurrency = mode === WorkType.GlobalParallel ? 5 : 1
        await scheduler.run(farmTasks, mode, {
          concurrency,
          randomPause: !!state.globalSettings?.RandomPause,
          minPauseMs: 50,
          maxPauseMs: 100,
          signal: controller.signal,
        })
        state.doneCount++
        notify(win, 'status:update', { doneCount: state.doneCount })
      } finally {
        controllers.delete(i)
        state.runningCount = Math.max(0, state.runningCount - 1)
        notify(win, 'status:update', { runningCount: state.runningCount })
      }
    })
    const mode = state.globalSettings?.WorkType ?? WorkType.GlobalOrder
    const concurrency = mode === WorkType.GlobalParallel ? 5 : 1
    await scheduler.run(tasks, mode, { concurrency })
  } finally {
    state.globalIsRunning = false
  }
  return true
})

ipcMain.handle('work:stopSingle', async (_e, idx: number) => {
  const c = controllers.get(idx)
  if (c) c.abort()
  controllers.delete(idx)
  return true
})

ipcMain.handle('work:stopAll', async () => {
  state.globalIsRunning = false
  for (const c of controllers.values()) c.abort()
  controllers.clear()
  return true
})