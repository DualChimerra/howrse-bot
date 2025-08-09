import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  // state
  state: {
    init: () => ipcRenderer.invoke('state:init'),
    get: () => ipcRenderer.invoke('state:get'),
    selectAccount: (idx: number) => ipcRenderer.invoke('state:selectAccount', idx),
  },
  // accounts
  accounts: {
    add: (acc: any) => ipcRenderer.invoke('accounts:add', acc),
    removeSelected: () => ipcRenderer.invoke('accounts:removeSelected'),
    saveAll: () => ipcRenderer.invoke('accounts:saveAll'),
    loadAll: () => ipcRenderer.invoke('accounts:loadAll'),
    saveCoSelected: () => ipcRenderer.invoke('accounts:saveCoSelected'),
  },
  // login
  login: {
    normal: (idx: number, load: boolean) => ipcRenderer.invoke('login:normal', idx, load),
    co: (idx: number, loginCo: string, load: boolean) => ipcRenderer.invoke('login:co', idx, loginCo, load),
    listCo: (idx: number) => ipcRenderer.invoke('login:listCo', idx),
    logoutCo: (idx: number) => ipcRenderer.invoke('login:logoutCo', idx),
  },
  // farms
  farms: {
    load: (idx: number) => ipcRenderer.invoke('farms:load', idx),
    addToQueue: (idx: number, id: string) => ipcRenderer.invoke('farms:addToQueue', idx, id),
    removeFromQueue: (idx: number, id: string) => ipcRenderer.invoke('farms:removeFromQueue', idx, id),
    clearQueue: (idx: number) => ipcRenderer.invoke('farms:clearQueue', idx),
  },
  // products
  products: {
    buy: (idx: number, type: number, quantity: string) => ipcRenderer.invoke('products:buy', idx, type, quantity),
    sell: (idx: number, type: number, quantity: string) => ipcRenderer.invoke('products:sell', idx, type, quantity),
  },
  // settings
  settings: {
    open: () => ipcRenderer.invoke('settings:open'),
    apply: (settings: any, scope: 'global'|'single') => ipcRenderer.invoke('settings:apply', settings, scope),
    saveToFile: (settings: any) => ipcRenderer.invoke('settings:saveToFile', settings),
    loadFromFile: () => ipcRenderer.invoke('settings:loadFromFile'),
  },
  // storage direct (for saved accounts XML)
  storage: {
    loadAccounts: () => ipcRenderer.invoke('accounts:loadAll'),
    saveAccounts: (arr: any[]) => ipcRenderer.invoke('accounts:saveAll', arr),
  },
  // work
  work: {
    startSingle: (idx: number) => ipcRenderer.invoke('work:startSingle', idx),
    startAll: () => ipcRenderer.invoke('work:startAll'),
    stopSingle: (idx: number) => ipcRenderer.invoke('work:stopSingle', idx),
    stopAll: () => ipcRenderer.invoke('work:stopAll'),
  },
  // globals
  globals: {
    update: (patch: any) => ipcRenderer.invoke('globals:update', patch),
  },
  // events
  events: {
    onNotify: (cb: (payload: any) => void) => ipcRenderer.on('notify', (_e, payload) => cb(payload)),
    onStatusUpdate: (cb: (payload: any) => void) => ipcRenderer.on('status:update', (_e, payload) => cb(payload)),
  },
}

contextBridge.exposeInMainWorld('api', api)
