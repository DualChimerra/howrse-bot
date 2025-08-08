import { CookieJar } from 'tough-cookie'
import ClientFetch from './ClientFetch'
import RequestClient from './RequestClient'
import { loadCookieJar } from './cookies'

export interface IClient {
  baseAddress: string
  sid?: string
  cookieJar: CookieJar
  abortController: AbortController
  get: (url: string) => Promise<string>
  post: (url: string, data: string) => Promise<string>
  setSID: () => void
}

export function getClientFactory() {
  return async (type: 'new'|'old', baseAddress: string, proxy?: string) => {
    const key = `${baseAddress}|${proxy ?? ''}|${type}`
    const jar = await loadCookieJar(key)
    if (type === 'old') return new RequestClient(baseAddress, jar, proxy, key)
    return new ClientFetch(baseAddress, jar, proxy, key)
  }
}