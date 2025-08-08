import { CookieJar } from 'tough-cookie'
import ClientFetch from './ClientFetch'
import RequestClient from './RequestClient'

export interface IClient {
  sid?: string
  cookieJar: CookieJar
  baseUrl: string
  get: (url: string) => Promise<string>
  post: (url: string, data: string) => Promise<string>
}

export function getClientFactory() {
  return (type: 'new'|'old', baseUrl: string, proxy?: string) => {
    const jar = new CookieJar()
    if (type === 'old') return new RequestClient(baseUrl, jar, proxy)
    return new ClientFetch(baseUrl, jar, proxy)
  }
}