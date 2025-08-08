import { app } from 'electron'
import { join } from 'node:path'

export const settingsDir = join(app.getPath('userData'), 'settings')
export const accountsXml = join(settingsDir, 'Accounts.xml')
export const globalSettingsXml = join(settingsDir, 'Settings.xml')
export const cookiesDir = join(app.getPath('userData'), 'cookies')