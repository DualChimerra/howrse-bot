import { promises as fs } from 'node:fs'
import { dirname } from 'node:path'

export async function mkdirp(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
}

export async function ensureFile(filePath: string) {
  await mkdirp(dirname(filePath))
  try { await fs.access(filePath) } catch { await fs.writeFile(filePath, '') }
}