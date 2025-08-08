import got, { OptionsOfTextResponseBody } from 'got'
import { CookieJar } from 'tough-cookie'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { HttpProxyAgent } from 'http-proxy-agent'
import type { IClient } from './IClient'

export default class RequestClient implements IClient {
  cookieJar: CookieJar
  baseUrl: string
  sid?: string
  private requester: ReturnType<typeof got.extend>

  constructor(baseUrl: string, cookieJar: CookieJar, proxy?: string) {
    this.baseUrl = baseUrl
    this.cookieJar = cookieJar

    const agent = proxy ? {
      http: new HttpProxyAgent(proxy),
      https: new HttpsProxyAgent(proxy),
    } : undefined

    this.requester = got.extend({
      prefixUrl: baseUrl,
      cookieJar: this.cookieJar,
      agent,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100 Safari/537.36 OPR/86.0.4363.59',
        'accept-language': 'en-US;q=0.8,en;q=0.7',
        'accept-encoding': 'gzip, deflate, br',
        'connection': 'keep-alive',
        'x-requested-with': 'XMLHttpRequest',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      },
      decompress: true,
      followRedirect: true,
      retry: { limit: 0 },
      throwHttpErrors: false,
      hooks: {
        afterResponse: [res => {
          const cookies = res.headers['set-cookie']
          if (cookies) {
            for (const str of cookies) {
              if (str.includes('sessionprod=')) {
                const value = /sessionprod=([^;]+)/.exec(str)?.[1]
                if (value) this.sid = value
              }
            }
          }
          return res
        }]
      }
    })
  }

  private async exec<T extends 'GET'|'POST'>(method: T, url: string, body?: string): Promise<string> {
    let answer = ''
    let ok = false
    while (!ok) {
      try {
        const options: OptionsOfTextResponseBody = {}
        if (method === 'POST') {
          options.body = body
          options.headers = { 'content-type': 'application/x-www-form-urlencoded' }
        }
        const res = await this.requester(url, { method, ...options })
        if (res.statusCode >= 200 && res.statusCode < 300) {
          answer = res.body
          ok = true
        } else {
          // retry
        }
      } catch {
        // retry
      }
    }
    return answer
  }

  async get(url: string): Promise<string> { return this.exec('GET', url) }
  async post(url: string, data: string): Promise<string> { return this.exec('POST', url, data) }
}