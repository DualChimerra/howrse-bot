import { CookieJar } from 'tough-cookie'

export function extractSidFromJar(jar: CookieJar, baseUrl: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    jar.getCookies(baseUrl, (err, cookies) => {
      if (err) return reject(err)
      const sid = cookies.find(c => c.key === 'sessionprod')?.value
      resolve(sid)
    })
  })
}