import fetch, { Headers, RequestInit } from 'node-fetch'
import fetchCookie from 'fetch-cookie'
import { CookieJar } from 'tough-cookie'
import { Server, ClientType, WorkType } from '../src/common/enums.js'
import { AccountLogic } from '../src/main/logic/AccountCli.js'
import { Farm } from '../src/main/logic/Farm.js'

function defaultHeaders(base: string): Headers {
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

function createHttp(baseAddress: string) {
  const jar = new CookieJar()
  const fo = fetchCookie(fetch, jar)
  const exec = async (method: 'GET'|'POST', url: string, body?: string): Promise<string> => {
    let ok = false
    let answer = ''
    const headers = defaultHeaders(baseAddress)
    const timeoutSignal = AbortSignal.timeout(45000)
    const init: RequestInit = { method, headers, signal: timeoutSignal, redirect: 'follow' }
    if (method === 'POST') { headers.set('Content-Type', 'application/x-www-form-urlencoded'); init.body = body }
    while (!ok) {
      try {
        const res = await fo(baseAddress + url, init)
        const text = await res.text()
        if (res.ok) { answer = text; ok = true } else { /* retry */ }
      } catch (e) { /* retry until timeout */ }
    }
    return answer
  }
  const client = {
    baseAddress,
    cookieJar: jar,
    abortController: new AbortController(),
    sid: undefined as string | undefined,
    async get(url: string) { return exec('GET', url) },
    async post(url: string, data: string) { return exec('POST', url, data) },
    setSID() { /* no-op for CLI */ },
  }
  return client
}

function defaultSettings() {
  return {
    HorsingFemale: false,
    HorsingFemalePrice: '500',
    Breeder: '',
    ClearBlood: false,
    SelfMale: false,
    BuyWheat: false,
    HorsingFemaleCommand: false,
    GPEdge: '1000',
    HorsingMale: false,
    HorsingMaleCommand: false,
    HorsingMalePrice: '500',
    Carrot: false,
    MaleName: 'Муж',
    FemaleName: 'Жен',
    Affix: '',
    Farm: '',
    RandomNames: false,
    CentreDuration: '3',
    CentreHay: false,
    CentreOat: false,
    ReserveID: '',
    ReserveDuration: '',
    ContinueDuration: '',
    SelfReserve: false,
    WriteToAll: false,
    Continue: false,
    BuyHay: '500',
    BuyOat: '500',
    MainProductToSell: 3,
    SubProductToSell: 0,
    SellShit: false,
    Mission: false,
    OldHorses: false,
    HealthEdge: '0',
    SkipIndex: 0,
    LoadSleep: true,
    GoBabies: false,
    Stroke: false,
    MissionOld: false,
    Sharing: false,
  }
}

async function main() {
  const login = process.env.HOWRSE_LOGIN || 'Numb9'
  const password = process.env.HOWRSE_PASSWORD || 'Er3rt5n90745555m!'
  const server: Server = Server.International
  const base = 'https://www.howrse.com'

  const settings = defaultSettings()
  const logic = new AccountLogic(login, password, server, settings as any)
  // attach lightweight http client
  // @ts-ignore
  logic.client = createHttp(base)
  logic.initProducts()

  console.log('Logging in...')
  const ok = await logic.loginNormal(true)
  console.log('Login result:', ok)
  if (!ok) process.exit(2)
  console.log('Equus:', logic.equ, 'Pass:', logic.passCount)

  // Load farms list roughly like farms:load
  const html = await logic.client.get('/elevage/chevaux/?elevage=all-horses')
  const { parseDocument } = await import('../src/main/logic/Parser.js')
  const $ = parseDocument(html)
  const tabs = $('.tab-action-select')
  const farms: { Name: string; Id: string }[] = []
  tabs.each((_, el) => {
    const id = $(el).attr('id') || ''
    const alt = $(el).attr('alt') || ''
    if (id === 'new-breeding' || alt === '+') return
    if (!id) farms.push({ Name: $(el).text().trim(), Id: '' })
    else farms.push({ Name: $(el).text().trim(), Id: id.split('-')[2] })
  })
  console.log('Farms found:', farms.map(f=>`${f.Name}(${f.Id})`).join(', '))
  const chosen = farms.find(f=> f.Id) || { Name: 'all', Id: '' }

  // Run a short pass on one farm with a time limit
  const global = { Sort: 'age', WorkType: WorkType.SingleOrder, ClientType: ClientType.New, ParallelHorse: false, RandomPause: false, Tray: true, MoneyNotification: false, Localization: 0, Settings: settings as any }
  const farm = new Farm(chosen.Name, chosen.Id, logic)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000) // 60s safety
  try {
    console.log('Starting farm run:', chosen)
    await farm.run(global as any, controller.signal, (kind, value) => {
      if (kind === 'farm') console.log('Farm:', value)
      else if (kind === 'horse') console.log('Horse:', value)
    })
    console.log('Farm run completed')
  } catch (e:any) {
    console.error('Run error:', e?.message || String(e))
  } finally { clearTimeout(timeout) }
}

main().catch(err => { console.error(err); process.exit(1) })