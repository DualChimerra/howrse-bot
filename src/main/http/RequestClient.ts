import fetch, { RequestInit, Headers } from 'node-fetch'
import fetchCookie from 'fetch-cookie'
import { CookieJar } from 'tough-cookie'
import type { IClient } from './IClient'
import { buildAgents } from './proxy'
import { saveCookieJar } from './cookies'

const fetchWithCookies = (jar: CookieJar) => fetchCookie(fetch, jar)
const REQUEST_TIMEOUT_MS = 45000

export default class RequestClient implements IClient {
  baseAddress: string
  cookieJar: CookieJar
  sid?: string
  abortController: AbortController
  private proxyUrl?: string
  private jarKey?: string

  constructor(baseAddress: string, jar: CookieJar, proxy?: string, jarKey?: string) {
    this.baseAddress = baseAddress
    this.cookieJar = jar
    this.proxyUrl = proxy
    this.abortController = new AbortController()
    this.jarKey = jarKey
  }

  setSID() {
    this.cookieJar.getCookies(this.baseAddress, (err, cookies) => {
      if (err) return
      const sid = cookies.find(c => c.key === 'sessionprod')?.value
      if (sid) this.sid = sid
    })
  }

  private defaultHeaders(): Headers {
    const h = new Headers()
    h.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 OPR/86.0.4363.59')
    h.set('Accept-Language', 'en-US;q=0.8,en;q=0.7')
    h.set('Accept-Encoding', 'gzip, deflate, br, zstd')
    h.set('Connection', 'keep-alive')
    h.set('Origin', this.baseAddress)
    h.set('X-Requested-With', 'XMLHttpRequest')
    h.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7')
    return h
  }

  private async exec(method: 'GET'|'POST', url: string, body?: string): Promise<string> {
    let answer = ''
    let ok = false
    const fo = fetchWithCookies(this.cookieJar)
    const agents = buildAgents(this.proxyUrl)

    while (!ok) {
      const headers = this.defaultHeaders()
      const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      const signal = AbortSignal.any([this.abortController.signal, timeoutSignal])
      const init: RequestInit = {
        method,
        headers,
        signal,
        redirect: 'follow',
      }
      if (method === 'POST') {
        headers.set('Content-Type', 'application/x-www-form-urlencoded')
        init.body = body
      }
      if (agents) {
        init.agent = (parsedURL: URL) => parsedURL.protocol === 'http:' ? agents.http : agents.https
      }
      try {
        const res = await fo(this.baseAddress + url, init)
        const text = await res.text()
        if (res.ok) {
          answer = text
          if (res.url.includes('/site/logIn?redirection=')) {
            answer = await this.get(url)
          }
          if (answer.includes('\/site\/logIn')) {
            answer = await this.post(url, body || '')
          }
          ok = true
        } else {
          // retry
        }
      } catch (e: any) {
        if (this.abortController.signal.aborted) {
          throw e
        }
        // timeout or transient error => retry
      }
    }
    this.setSID()
    if (this.jarKey) await saveCookieJar(this.cookieJar, this.jarKey)
    return answer
  }

  async get(url: string): Promise<string> { return this.exec('GET', url) }
  async post(url: string, data: string): Promise<string> { return this.exec('POST', url, data) }
}