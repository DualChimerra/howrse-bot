import fetch, { Headers, RequestInit } from 'node-fetch'
import fetchCookie from 'fetch-cookie'
import { CookieJar } from 'tough-cookie'
import { load as loadHtml } from 'cheerio'

const base = 'https://www.howrse.com'

function headers(): Headers {
  const h = new Headers()
  h.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 OPR/95.0.0.0')
  h.set('Connection', 'keep-alive')
  h.set('Accept-Language', 'en-US;q=0.8,en;q=0.7')
  h.set('Accept-Encoding', 'gzip, deflate, br, zstd')
  h.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7')
  h.set('Origin', base)
  h.set('Upgrade-Insecure-Requests', '1')
  h.set('X-Requested-With', 'XMLHttpRequest')
  return h
}

async function main() {
  const login = process.env.HOWRSE_LOGIN || ''
  const password = process.env.HOWRSE_PASSWORD || ''
  if (!login || !password) { console.error('Set HOWRSE_LOGIN and HOWRSE_PASSWORD'); process.exit(1) }

  const jar = new CookieJar()
  const fo = fetchCookie(fetch, jar)

  const get = async (url: string) => {
    const res = await fo(base + url, { method: 'GET', headers: headers(), redirect: 'follow', signal: AbortSignal.timeout(45000) })
    return res.text()
  }
  const post = async (url: string, body: string) => {
    const h = headers(); h.set('Content-Type', 'application/x-www-form-urlencoded')
    const res = await fo(base + url, { method: 'POST', headers: h, body, redirect: 'follow', signal: AbortSignal.timeout(45000) })
    return res.text()
  }

  console.log('GET /')
  const preHtml = await get('/')
  const $ = loadHtml(preHtml)
  const hidden = $('#authentification input').eq(0)
  const name = (hidden.attr('name') || '').toLowerCase()
  const value = (hidden.attr('value') || '').toLowerCase()
  if (!name || !value) { console.error('Hidden input not found'); process.exit(2) }
  const postData = `${name}=${value}&login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}&redirection=&isBoxStyle=`

  console.log('POST /site/doLogIn')
  const answer = await post('/site/doLogIn', postData)
  const ok = answer.includes('?identification=1') || answer.includes('"errors":[]')
  console.log('Login OK:', ok)
  if (!ok) { console.error('Login failed'); process.exit(3) }

  console.log('GET farms...')
  const farmsHtml = await get('/elevage/chevaux/?elevage=all-horses')
  const $f = loadHtml(farmsHtml)
  const tabs = $f('.tab-action-select')
  const farms: { Name: string; Id: string }[] = []
  tabs.each((_, el) => {
    const id = $f(el).attr('id') || ''
    const alt = $f(el).attr('alt') || ''
    if (id === 'new-breeding' || alt === '+') return
    if (!id) farms.push({ Name: $f(el).text().trim(), Id: '' })
    else farms.push({ Name: $f(el).text().trim(), Id: id.split('-')[2] })
  })
  console.log('Farms:', farms.map(f => `${f.Name}(${f.Id})`).join(', '))
}

main().catch(err => { console.error(err); process.exit(1) })