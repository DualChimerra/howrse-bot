import { CookieJar } from 'tough-cookie'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { cookiesDir } from '../storage/paths'
import { mkdirp } from '../logic/fs'

export function extractSidFromJar(jar: CookieJar, baseUrl: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    jar.getCookies(baseUrl, (err, cookies) => {
      if (err) return reject(err)
      const sid = cookies.find(c => c.key === 'sessionprod')?.value
      resolve(sid)
    })
  })
}

export async function saveCookieJar(jar: CookieJar, accountKey: string) {
  const file = getCookieFilePath(accountKey)
  await mkdirp(dirname(file))
  const serialized = await new Promise<string>((resolve, reject) => jar.serialize((err, obj) => err ? reject(err) : resolve(JSON.stringify(obj))))
  await fs.writeFile(file, serialized, 'utf8')
}

export async function loadCookieJar(accountKey: string) {
  const file = getCookieFilePath(accountKey)
  try {
    const data = await fs.readFile(file, 'utf8')
    const obj = JSON.parse(data)
    return await new Promise<CookieJar>((resolve, reject) => CookieJar.deserialize(obj, (err, jar) => err ? reject(err) : resolve(jar)))
  } catch {
    return new CookieJar()
  }
}

export function getCookieFilePath(accountKey: string) {
  return join(cookiesDir, `${sanitizeKey(accountKey)}.json`)
}

function sanitizeKey(key: string) {
  return key.replace(/[^a-z0-9-_\.]/gi, '_')
}

export async function updateSidFromJar(jar: CookieJar, baseUrl: string): Promise<string | undefined> {
  const sid = await extractSidFromJar(jar, baseUrl)
  return sid
}