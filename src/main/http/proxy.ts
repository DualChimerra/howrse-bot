import { HttpsProxyAgent } from 'https-proxy-agent'
import { HttpProxyAgent } from 'http-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

export function buildProxyUrl(ip?: string, login?: string, password?: string): string | undefined {
  if (!ip) return undefined
  const auth = login && password ? `${encodeURIComponent(login)}:${encodeURIComponent(password)}@` : ''
  // default to http proxy scheme; caller may pass socks5:// in ip to force socks
  const hasScheme = /^https?:\/\//i.test(ip) || /^socks/i.test(ip)
  const url = hasScheme ? `${auth ? ip.replace('://', `://${auth}`) : ip}` : `http://${auth}${ip}`
  return url
}

export function buildAgents(proxyUrl?: string) {
  if (!proxyUrl) return undefined
  if (/^socks/i.test(proxyUrl)) {
    const agent = new SocksProxyAgent(proxyUrl)
    return { http: agent as any, https: agent as any }
  }
  return {
    http: new HttpProxyAgent(proxyUrl),
    https: new HttpsProxyAgent(proxyUrl),
  }
}