import { Product } from './Product'
import { ProductType, ClientType, Server } from '@common/enums'
import { serverBaseUrls } from '@common/converters'
import type { Settings } from '@common/types'
import type { IClient } from '../http/IClient'

export class AccountLogic {
  login: string
  password: string
  server: Server
  client!: IClient
  settings: Settings
  products!: Record<string, Product>

  constructor(login: string, password: string, server: Server, settings: Settings) {
    this.login = login
    this.password = password
    this.server = server
    this.settings = settings
  }

  initClient(factory: (type: 'new'|'old', baseUrl: string, proxy?: string) => IClient, clientType: ClientType, proxy?: string) {
    const baseUrl = serverBaseUrls[this.server]
    this.client = factory(clientType === ClientType.New ? 'new' : 'old', baseUrl, proxy)
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
}