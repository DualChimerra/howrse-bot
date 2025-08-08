import { AccountType, ClientType, Localization, ProductType, Server, WorkType, HorseSex } from './enums'

// BaseModel analogue (INotifyPropertyChanged in C#)
export interface BaseModel {
  PropertyChanged?: unknown
}

export interface Product extends BaseModel {
  Type: ProductType
  Id: string
  Amount: number
  SellPrice: number
}

export interface Horse {
  Id: string
  Name: string
  Sex: HorseSex
  Health: number
  Energy: number
  Age: number
}

export interface Farm extends BaseModel {
  Name: string
  Count: string
  Id: string
  Acc: Account
  Horses: Horse[]
  Settings: GlobalSettings
}

export interface Settings extends BaseModel {
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

export interface Account extends BaseModel {
  // Ignorable props in C# (runtime-only), kept here for parity
  Servers: Record<Server, string>
  Client?: unknown
  Hay?: Product
  Oat?: Product
  Wheat?: Product
  Shit?: Product
  Leather?: Product
  Apples?: Product
  Carrot?: Product
  Wood?: Product
  Steel?: Product
  Sand?: Product
  Straw?: Product
  Flax?: Product
  OR?: Product
  MainProductToSell?: Product
  SubProductToSell?: Product
  Equ?: number
  Farms?: Farm[]
  Queue?: Farm[]
  CoAccounts?: string[]
  IsRunning?: boolean
  IsLoading?: boolean
  IsDone?: boolean
  Cts?: unknown
  Progress?: string
  ProgressFarm?: string
  ProgressHorse?: string
  Settings?: Settings
  Notifications?: string[]
  OREND?: string
  IsEquMessageShown?: boolean
  Pass?: string

  // Serializable/public settings
  Login: string
  Password: string
  Server: Server
  Type: AccountType
  PrivateSettings: Settings
  LoginCo?: string
  ProxyIP: string
  ProxyLogin: string
  ProxyPassword: string

  FarmsQueue: string[]
}

export interface GlobalSettings extends BaseModel {
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