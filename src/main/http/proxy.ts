export function buildProxyUrl(ip?: string, login?: string, password?: string): string | undefined {
  if (!ip) return undefined
  const auth = login && password ? `${encodeURIComponent(login)}:${encodeURIComponent(password)}@` : ''
  const url = `http://${auth}${ip}`
  return url
}