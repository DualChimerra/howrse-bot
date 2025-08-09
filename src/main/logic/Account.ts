import { Product } from './Product'
import { ProductType, ClientType, Server } from '@common/enums'
import { serverBaseUrls } from '@common/converters'
import type { Settings } from '@common/types'
import type { IClient } from '../http/IClient'
import { parseDocument, parseDocumentFromJson } from './Parser'

export class AccountLogic {
  login: string
  password: string
  server: Server
  client!: IClient
  settings: Settings
  products!: Record<string, Product>
  equ: number = 0
  passCount: string = ''

  constructor(login: string, password: string, server: Server, settings: Settings) {
    this.login = login
    this.password = password
    this.server = server
    this.settings = settings
  }

  async initClient(factory: (type: 'new'|'old', baseAddress: string, proxy?: string) => Promise<IClient>, clientType: ClientType, proxy?: string) {
    const baseUrl = serverBaseUrls[this.server]
    this.client = await factory(clientType === ClientType.New ? 'new' : 'old', baseUrl, proxy)
  }

  initProducts() {
    const baseUrl = serverBaseUrls[this.server]
    this.products = {
      Hay: new Product(baseUrl, ProductType.Hay, 1),
      Oat: new Product(baseUrl, ProductType.Oat, 1),
      Wheat: new Product(baseUrl, ProductType.Wheat, 1),
      Shit: new Product(baseUrl, ProductType.Shit, 3),
      Leather: new Product(baseUrl, ProductType.Leather, 5),
      Apples: new Product(baseUrl, ProductType.Apples, 3),
      Carrot: new Product(baseUrl, ProductType.Carrot, 10),
      Wood: new Product(baseUrl, ProductType.Wood, 5),
      Steel: new Product(baseUrl, ProductType.Steel, 5),
      Sand: new Product(baseUrl, ProductType.Sand, 5),
      Straw: new Product(baseUrl, ProductType.Straw, 10),
      Flax: new Product(baseUrl, ProductType.Flax, 25),
      OR: new Product(baseUrl, ProductType.OR, 0),
    }
  }

  async loginNormal(load: boolean): Promise<boolean> {
    const baseUrl = serverBaseUrls[this.server]
    // standard servers vs equideow special login
    if (this.server === Server.FranceGaia || this.server === Server.FranceOuranos) {
      // Phase 1: login on www.equideow.com
      // GET "/" to retrieve hidden token
      const preHtml = await this.client.get('/')
      const $pre = parseDocument(preHtml)
      const hidden = $pre('#authentification input').eq(0)
      const name = (hidden.attr('name') || '').toLowerCase()
      const value = (hidden.attr('value') || '').toLowerCase()
      const to = this.server === Server.FranceOuranos ? 'ouranos' : 'gaia'
      const postData = `${name}=${value}&to=${to}&login=${encodeURIComponent(this.login)}&password=${encodeURIComponent(this.password)}&redirection=&isBoxStyle=`
      const answer = await this.client.post('/site/doLogIn', postData)
      if (answer.includes('?identification=1') || answer.includes('"errors":[]')) {
        const urlMatch = answer.match(/"redirection":"(.*?)"}/)
        if (!urlMatch) return false
        const url = urlMatch[1].replace(/\\/g, '')
        const query = url.substring(baseUrl.length)
        // Phase 2: switch to specific base
        const factoryType = 'new' as const
        const proxy = undefined
        // keep same client but just GET the redirection on the same client baseAddress is equideow; we must create new client with baseUrl
        // Caller should re-init client externally if base change is needed; here we assume client already has baseAddress set to final baseUrl
        // To ensure base switch, do a GET against resolved path on current client (handled by server redirection)
        await this.client.get(query)
        this.client.setSID()
        if (load) await this.loadInfo()
        return true
      }
      return false
    } else {
      // normal servers: GET / to fetch hidden token
      const preHtml = await this.client.get('/')
      const $ = parseDocument(preHtml)
      const hidden = $('#authentification input').eq(0)
      const name = (hidden.attr('name') || '').toLowerCase()
      const value = (hidden.attr('value') || '').toLowerCase()
      const postData = `${name}=${value}&login=${encodeURIComponent(this.login)}&password=${encodeURIComponent(this.password)}&redirection=&isBoxStyle=`
      const answer = await this.client.post('/site/doLogIn', postData)
      if (answer.includes('?identification=1') || answer.includes('"errors":[]')) {
        if (load) await this.loadInfo()
        this.client.setSID()
        return true
      }
      return false
    }
  }

  async loginCo(loginCo: string, load: boolean): Promise<boolean> {
    const html = await this.client.get('/member/account/?type=sharing')
    const $ = parseDocument(html)
    const tables = $('.table--striped')
    if (tables.length < 2) return false
    const names = tables.eq(1).find('.usergroup_2')
    const buttons = tables.eq(1).find('.btn--primary')

    for (let i = 0; i < names.length; i++) {
      const name = names.eq(i).text()
      const disabled = buttons.eq(i).attr('class')?.includes('btn--disabled')
      if (!disabled && name === loginCo) {
        const script = buttons.eq(i).parent().find('script').first().html() || ''
        const idMatch = script.match(/\{'params':'user=(.*?)'\}/)
        if (!idMatch) return false
        const id = idMatch[1]
        const answer = await this.client.post('/site/doLogInCoAccount', `user=${id}`)
        if (answer.includes('shareModeAlreadyUsed') || answer.includes('shareModeNotAuthorized')) return false
        if (load) await this.loadInfo()
        return true
      }
    }
    return false
  }

  async loadInfo(): Promise<void> {
    // instantiate products and load inventory
    this.initProducts()
    await this.loadProducts()
    // farms list handled elsewhere in Farm port (not included here)
  }

  private checkValues($: ReturnType<typeof parseDocument>, product: Product) {
    const inv = $(`#inventaire${product.id}`)
    product.amount = inv.length ? Number(inv.text()) : 0
  }

  async loadProducts(): Promise<void> {
    const html = await this.client.get('/marche/boutiqueVendre')
    const $ = parseDocument(html)
    this.checkValues($, this.products.Hay)
    this.checkValues($, this.products.Oat)
    this.checkValues($, this.products.Wheat)
    this.checkValues($, this.products.Shit)
    this.checkValues($, this.products.Leather)
    this.checkValues($, this.products.Apples)
    this.checkValues($, this.products.Carrot)
    this.checkValues($, this.products.Wood)
    this.checkValues($, this.products.Steel)
    this.checkValues($, this.products.Sand)
    this.checkValues($, this.products.Straw)
    this.checkValues($, this.products.Flax)
    this.checkValues($, this.products.OR)
    this.passCount = ($('#pass').text() || '').trim()
    const reserve = $('#reserve')
    if (reserve.length) {
      this.equ = Number(reserve.attr('data-amount') || 0)
    }
  }

  async sell(product: Product, quantity: string): Promise<void> {
    await this.client.post('/marche/vente', `id=${product.id}&nombre=${quantity}&mode=eleveur`)
  }

  async buy(product: Product, quantity: string): Promise<void> {
    let total = Number(quantity)
    let count = Math.floor(total / 100000)
    for (let i = 0; i < count; i++) {
      await this.client.post('/marche/achat', `id=${product.id}&mode=eleveur&nombre=100000&typeRedirection=&idElement=`)
      total -= 100000
    }
    if (Math.floor(total / 10000) * 10000 > 0) {
      const num = Math.floor(total / 10000) * 10000
      await this.client.post('/marche/achat', `id=${product.id}&mode=eleveur&nombre=${num}&typeRedirection=&idElement=`)
      total -= num
    }
    if (Math.floor(total / 1000) * 1000 > 0) {
      const num = Math.floor(total / 1000) * 1000
      await this.client.post('/marche/achat', `id=${product.id}&mode=eleveur&nombre=${num}&typeRedirection=&idElement=`)
      total -= num
    }
    if (Math.floor(total / 100) * 100 > 0) {
      const num = Math.floor(total / 100) * 100
      await this.client.post('/marche/achat', `id=${product.id}&mode=eleveur&nombre=${num}&typeRedirection=&idElement=`)
      total -= num
    }
    if (Math.floor(total / 10) * 10 > 0) {
      const num = Math.floor(total / 10) * 10
      await this.client.post('/marche/achat', `id=${product.id}&mode=eleveur&nombre=${num}&typeRedirection=&idElement=`)
      total -= num
    }
    if (total > 0) {
      await this.client.post('/marche/achat', `id=${product.id}&mode=eleveur&nombre=${total}&typeRedirection=&idElement=`)
    }
  }

  getProductByType(type: ProductType): Product | null {
    switch (type) {
      case ProductType.Hay: return this.products.Hay
      case ProductType.Oat: return this.products.Oat
      case ProductType.Wheat: return this.products.Wheat
      case ProductType.Shit: return this.products.Shit
      case ProductType.Leather: return this.products.Leather
      case ProductType.Apples: return this.products.Apples
      case ProductType.Carrot: return this.products.Carrot
      case ProductType.Wood: return this.products.Wood
      case ProductType.Steel: return this.products.Steel
      case ProductType.Sand: return this.products.Sand
      case ProductType.Straw: return this.products.Straw
      case ProductType.Flax: return this.products.Flax
      case ProductType.OR: return this.products.OR
      default: return null
    }
  }

  getMainProductToSell(): Product | null {
    return this.getProductByType(this.settings.MainProductToSell)
  }

  getSubProductToSell(): Product | null {
    return this.getProductByType(this.settings.SubProductToSell)
  }

  async ensureFunds(targetEqu: number): Promise<void> {
    if (this.equ >= targetEqu) return
    const main = this.getMainProductToSell()
    const sub = this.getSubProductToSell()
    const need = targetEqu - this.equ
    if (main && main.amount * main.sellPrice > need) {
      await this.sell(main, Math.ceil(need / main.sellPrice).toString())
    } else if (sub && sub.amount * sub.sellPrice > need) {
      await this.sell(sub, Math.ceil(need / sub.sellPrice).toString())
    }
    await this.loadProducts()
  }
}