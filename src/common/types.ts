import { AccountType, ClientType, Localization, ProductType, Server, WorkType } from './enums'

export interface Settings {
  HorsingFemale: boolean
  HorsingFemalePrice: string
  Breeder: string
  ClearBlood: boolean
  SelfMale: boolean
  BuyWheat: boolean
  HorsingFemaleCommand: boolean
  GPEdge: string

  HorsingMale: boolean
  HorsingMaleCommand: boolean
  HorsingMalePrice: string
  Carrot: boolean

  MaleName: string
  FemaleName: string
  Affix: string
  Farm: string
  RandomNames: boolean

  CentreDuration: string
  CentreHay: boolean
  CentreOat: boolean

  ReserveID: string
  ReserveDuration: string
  ContinueDuration: string
  SelfReserve: boolean
  WriteToAll: boolean
  Continue: boolean

  BuyHay: string
  BuyOat: string
  MainProductToSell: ProductType
  SubProductToSell: ProductType
  SellShit: boolean

  Mission: boolean
  OldHorses: boolean
  HealthEdge: string
  SkipIndex: number
  LoadSleep: boolean
  GoBabies: boolean
  Stroke: boolean
  MissionOld: boolean
  Sharing: boolean
}

export interface Account {
  Login: string
  Password: string
  Server: Server
  Type: AccountType
  PrivateSettings: Settings
  LoginCo?: string
  ProxyIP?: string
  ProxyLogin?: string
  ProxyPassword?: string
  FarmsQueue: string[]
}

export interface GlobalSettings {
  Sort: string
  WorkType: WorkType
  ClientType: ClientType
  ParallelHorse: boolean
  RandomPause: boolean
  Tray: boolean
  MoneyNotification: boolean
  Localization: Localization
  Settings: Settings
}