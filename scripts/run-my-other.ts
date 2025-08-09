import fetch, { Headers } from 'node-fetch'
import fetchCookie from 'fetch-cookie'
import { CookieJar } from 'tough-cookie'
import { load as loadHtml, CheerioAPI } from 'cheerio'

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

function randInt(minInclusive: number, maxExclusive: number): number {
  return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive
}

async function login(fo: any, login: string, password: string) {
  const h = headers()
  const pre = await fo(base + '/', { method: 'GET', headers: h, redirect: 'follow', signal: AbortSignal.timeout(45000) })
  const preHtml = await pre.text()
  const $ = loadHtml(preHtml)
  const hidden = $('#authentification input').eq(0)
  const name = (hidden.attr('name') || '').toLowerCase()
  const value = (hidden.attr('value') || '').toLowerCase()
  const postData = `${name}=${value}&login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}&redirection=&isBoxStyle=`
  const h2 = headers(); h2.set('Content-Type', 'application/x-www-form-urlencoded')
  const res = await fo(base + '/site/doLogIn', { method: 'POST', headers: h2, body: postData, redirect: 'follow', signal: AbortSignal.timeout(45000) })
  const ans = await res.text()
  return ans.includes('?identification=1') || ans.includes('"errors":[]')
}

async function getHorses(fo: any) {
  const h = headers(); h.set('Content-Type', 'application/x-www-form-urlencoded')
  const postData = 'go=1&sort=age&filter=all'
  const res = await fo(base + '/elevage/chevaux/searchHorse', { method: 'POST', headers: h, body: postData, redirect: 'follow', signal: AbortSignal.timeout(45000) })
  const html = await res.text()
  const $ = loadHtml(html)
  const links = $('.horsename')
  const horses: { id: string; name: string }[] = []
  links.each((_, el) => {
    const href = $(el).attr('href') || ''
    const id = href.split('=')[1]
    const name = $(el).text().trim()
    if (id) horses.push({ id, name })
  })
  return horses
}

async function getHorseDoc(fo: any, id: string) {
  const res = await fo(base + `/elevage/chevaux/cheval?id=${id}`, { method: 'GET', headers: headers(), redirect: 'follow', signal: AbortSignal.timeout(45000) })
  const html = await res.text()
  return loadHtml(html)
}

function parseForm($: CheerioAPI, horseId: string, formId: string): string {
  const form = $(`#${formId}`)
  if (!form.length) return ''
  const inputs = form.find('input').toArray()
  if (inputs.length < 2) return ''

  const name1 = ($(inputs[0]).attr('name') || '').toLowerCase()
  const value1 = ($(inputs[0]).attr('value') || '').toLowerCase()
  if (formId === 'form-do-eat-treat-carotte') {
    return `${name1}=${value1}&id=${horseId}&friandise=carrote`
  }

  let postData = `${name1}=${value1}`
  const name2Full = ($(inputs[1]).attr('name') || '')
  const name2 = name2Full.substring(formId.length).toLowerCase()
  postData += `&${name2}=${horseId}`

  if (formId !== 'form-do-suckle' && inputs.length >= 4) {
    const name3Full = ($(inputs[2]).attr('name') || '')
    const name4Full = ($(inputs[3]).attr('name') || '')
    const name3 = name3Full.substring(formId.length).toLowerCase()
    const name4 = name4Full.substring(formId.length).toLowerCase()
    postData += `&${name3}=${randInt(20, 60)}&${name4}=${randInt(20, 60)}`
  }
  return postData
}

async function action(fo: any, $, horseId: string, formId: string, selector: string, actionPath: string) {
  const btn = $(selector)
  if (!btn.length) return false
  const cls = (btn.attr('class') || '')
  if (cls.includes('action-disabled')) return false
  const pd = parseForm($, horseId, formId)
  if (!pd) return false
  const h = headers(); h.set('Content-Type', 'application/x-www-form-urlencoded')
  const res = await fo(base + `/elevage/chevaux/${actionPath}`, { method: 'POST', headers: h, body: pd, redirect: 'follow', signal: AbortSignal.timeout(45000) })
  const txt = await res.text()
  return txt.length > 0
}

async function run() {
  const loginName = process.env.HOWRSE_LOGIN || ''
  const password = process.env.HOWRSE_PASSWORD || ''
  if (!loginName || !password) { console.error('Set HOWRSE_LOGIN and HOWRSE_PASSWORD'); process.exit(1) }

  const jar = new CookieJar()
  const fo = fetchCookie(fetch, jar)
  console.log('Login...')
  const ok = await login(fo, loginName, password)
  if (!ok) { console.error('Login failed'); process.exit(2) }

  console.log('Load My other horses...')
  const horses = await getHorses(fo)
  console.log('Found horses:', horses.length)
  const sample = horses.slice(0, Math.min(3, horses.length))
  for (const h of sample) {
    console.log('Horse:', h.name, h.id)
    let $ = await getHorseDoc(fo, h.id)
    await action(fo, $, h.id, 'form-do-groom', '#boutonPanser', 'doGroom')
    $ = await getHorseDoc(fo, h.id)
    await action(fo, $, h.id, 'form-do-drink', '#boutonBoire', 'doDrink')
    $ = await getHorseDoc(fo, h.id)
    await action(fo, $, h.id, 'form-do-night', '#boutonCoucher', 'doNight')
  }
  console.log('Done minimal pass on My other horses')
}

run().catch(e => { console.error(e); process.exit(1) })