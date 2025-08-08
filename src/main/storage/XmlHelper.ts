import { app } from 'electron'
import { join } from 'node:path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { parseStringPromise, Builder } from 'xml2js'

const settingsDir = join(app.getPath('userData'), 'settings')
const accPath = join(settingsDir, 'Accounts.xml')
const globalPath = join(settingsDir, 'Settings.xml')

function ensureDir() { if (!existsSync(settingsDir)) mkdirSync(settingsDir, { recursive: true }) }

export async function loadAccounts(): Promise<unknown[]> {
  ensureDir()
  if (!existsSync(accPath)) return []
  const xml = readFileSync(accPath, 'utf8')
  const obj = await parseStringPromise(xml, { explicitArray: false })
  // Expect .NET default root ArrayOfAccount
  const arr = obj?.ArrayOfAccount?.Account
  if (!arr) return []
  return Array.isArray(arr) ? arr : [arr]
}

export async function saveAccounts(accounts: unknown[]): Promise<boolean> {
  ensureDir()
  const builder = new Builder({ headless: true, rootName: 'ArrayOfAccount', renderOpts: { pretty: true } })
  const xml = builder.buildObject({ Account: accounts })
  writeFileSync(accPath, xml, 'utf8')
  return true
}

export async function loadGlobalSettings(): Promise<unknown> {
  ensureDir()
  if (!existsSync(globalPath)) return {}
  const xml = readFileSync(globalPath, 'utf8')
  const obj = await parseStringPromise(xml, { explicitArray: false })
  return obj?.GlobalSettings ?? {}
}

export async function saveGlobalSettings(settings: unknown): Promise<boolean> {
  ensureDir()
  const builder = new Builder({ headless: true, rootName: 'GlobalSettings', renderOpts: { pretty: true } })
  const xml = builder.buildObject(settings)
  writeFileSync(globalPath, xml, 'utf8')
  return true
}