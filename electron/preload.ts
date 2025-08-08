import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  storage: {
    loadAccounts: () => ipcRenderer.invoke('storage:loadAccounts'),
    saveAccounts: (accounts: unknown) => ipcRenderer.invoke('storage:saveAccounts', accounts),
    loadGlobalSettings: () => ipcRenderer.invoke('storage:loadGlobalSettings'),
    saveGlobalSettings: (settings: unknown) => ipcRenderer.invoke('storage:saveGlobalSettings', settings),
  },
  http: {
    request: (args: { baseUrl: string, proxy?: string, clientType: 'new'|'old', method: 'GET'|'POST', url: string, data?: string }) => ipcRenderer.invoke('http:request', args)
  },
  state: {
    init: () => ipcRenderer.invoke('state:init'),
    get: () => ipcRenderer.invoke('state:get'),
    selectAccount: (idx: number) => ipcRenderer.invoke('state:selectAccount', idx),
  },
  accounts: {
    add: (acc: unknown) => ipcRenderer.invoke('accounts:add', acc),
    removeSelected: () => ipcRenderer.invoke('accounts:removeSelected'),
    saveAll: () => ipcRenderer.invoke('accounts:saveAll'),
    loadAll: () => ipcRenderer.invoke('accounts:loadAll'),
    saveCoSelected: () => ipcRenderer.invoke('accounts:saveCoSelected'),
  },
  settings: {
    apply: (settings: unknown, scope: 'global'|'single') => ipcRenderer.invoke('settings:apply', settings, scope),
    saveToFile: (settings: unknown) => ipcRenderer.invoke('settings:saveToFile', settings),
    loadFromFile: () => ipcRenderer.invoke('settings:loadFromFile'),
  },
  login: {
    normal: (idx: number, load: boolean) => ipcRenderer.invoke('login:normal', idx, load),
    co: (idx: number, loginCo: string, load: boolean) => ipcRenderer.invoke('login:co', idx, loginCo, load),
    listCo: (idx: number) => ipcRenderer.invoke('login:listCo', idx),
    logoutCo: (idx: number) => ipcRenderer.invoke('login:logoutCo', idx),
  },
  farms: {
    load: (idx: number) => ipcRenderer.invoke('farms:load', idx),
    addToQueue: (idx: number, farmId: string) => ipcRenderer.invoke('farms:addToQueue', idx, farmId),
    removeFromQueue: (idx: number, farmId: string) => ipcRenderer.invoke('farms:removeFromQueue', idx, farmId),
    clearQueue: (idx: number) => ipcRenderer.invoke('farms:clearQueue', idx),
  },
  products: {
    buy: (idx: number, type: number, quantity: string) => ipcRenderer.invoke('products:buy', idx, type, quantity),
    sell: (idx: number, type: number, quantity: string) => ipcRenderer.invoke('products:sell', idx, type, quantity),
  },
  work: {
    startSingle: (idx: number) => ipcRenderer.invoke('work:startSingle', idx),
    startAll: () => ipcRenderer.invoke('work:startAll'),
    stopSingle: (idx: number) => ipcRenderer.invoke('work:stopSingle', idx),
    stopAll: () => ipcRenderer.invoke('work:stopAll'),
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  events: {
    onStatusUpdate: (cb: (payload: any) => void) => ipcRenderer.on('status:update', (_e, p) => cb(p)),
    onNotify: (cb: (payload: any) => void) => ipcRenderer.on('notify', (_e, p) => cb(p)),
  }
})

declare global {
  interface Window {
    api: {
      storage: {
        loadAccounts: () => Promise<unknown>
        saveAccounts: (accounts: unknown) => Promise<unknown>
        loadGlobalSettings: () => Promise<unknown>
        saveGlobalSettings: (settings: unknown) => Promise<unknown>
      }
      http: {
        request: (args: { baseUrl: string, proxy?: string, clientType: 'new'|'old', method: 'GET'|'POST', url: string, data?: string }) => Promise<string>
      }
      state: {
        init: () => Promise<any>
        get: () => Promise<any>
        selectAccount: (idx: number) => Promise<boolean>
      }
      accounts: {
        add: (acc: unknown) => Promise<boolean>
        removeSelected: () => Promise<boolean>
        saveAll: () => Promise<boolean>
        loadAll: () => Promise<any>
        saveCoSelected: () => Promise<boolean>
      }
      settings: {
        apply: (settings: unknown, scope: 'global'|'single') => Promise<boolean>
        saveToFile: (settings: unknown) => Promise<boolean>
        loadFromFile: () => Promise<any>
      }
      login: {
        normal: (idx: number, load: boolean) => Promise<boolean>
        co: (idx: number, loginCo: string, load: boolean) => Promise<boolean>
        listCo: (idx: number) => Promise<string[]>
        logoutCo: (idx: number) => Promise<boolean>
      }
      farms: {
        load: (idx: number) => Promise<any>
        addToQueue: (idx: number, farmId: string) => Promise<boolean>
        removeFromQueue: (idx: number, farmId: string) => Promise<boolean>
        clearQueue: (idx: number) => Promise<boolean>
      }
      products: {
        buy: (idx: number, type: number, quantity: string) => Promise<boolean>
        sell: (idx: number, type: number, quantity: string) => Promise<boolean>
      }
      work: {
        startSingle: (idx: number) => Promise<boolean>
        startAll: () => Promise<boolean>
        stopSingle: (idx: number) => Promise<boolean>
        stopAll: () => Promise<boolean>
      }
      window: {
        minimize: () => Promise<void>
        maximize: () => Promise<void>
        close: () => Promise<void>
      }
      events: {
        onStatusUpdate: (cb: (payload: any) => void) => void
        onNotify: (cb: (payload: any) => void) => void
      }
    }
  }
}