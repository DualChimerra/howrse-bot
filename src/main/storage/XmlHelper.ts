import { app } from 'electron'
import { join } from 'node:path'
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, copyFileSync } from 'node:fs'
import { parseStringPromise, Builder } from 'xml2js'

const settingsDir = join(app.getPath('userData'), 'settings')
const accPath = join(settingsDir, 'Accounts.xml')
const globalPath = join(settingsDir, 'Settings.xml')

function ensureDir() { if (!existsSync(settingsDir)) mkdirSync(settingsDir, { recursive: true }) }

function migrateIfNeeded() {
  ensureDir()
  const hasAny = readdirSync(settingsDir).length > 0
  if (!hasAny) {
    const devDir = join(process.cwd(), 'settings')
    if (existsSync(devDir)) {
      for (const f of readdirSync(devDir)) {
        copyFileSync(join(devDir, f), join(settingsDir, f))
      }
    }
    const resDir = join(process.resourcesPath, 'settings')
    if (existsSync(resDir)) {
      for (const f of readdirSync(resDir)) {
        copyFileSync(join(resDir, f), join(settingsDir, f))
      }
    }
  }
}

export function getSettingsPaths() {
  return { settingsDir, accPath, globalPath }
}

export async function loadAccounts(): Promise<unknown[]> {
  migrateIfNeeded()
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
  migrateIfNeeded()
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