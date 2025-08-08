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
    }
  }
}