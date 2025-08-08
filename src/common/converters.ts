import { AccountType, ProductType, WorkType, ClientType, Server } from './enums'

export const serverBaseUrls: Record<Server, string> = {
  [Server.Australia]: 'https://au.howrse.com',
  [Server.England]: 'https://www.howrse.co.uk',
  [Server.Arabic]: 'https://ar.howrse.com',
  [Server.Bulgaria]: 'https://www.howrse.bg',
  [Server.International]: 'https://www.howrse.com',
  [Server.Spain]: 'https://www.caballow.com',
  [Server.Canada]: 'https://ca.howrse.com',
  [Server.Germany]: 'https://www.howrse.de',
  [Server.Norway]: 'https://www.howrse.no',
  [Server.Poland]: 'https://www.howrse.pl',
  [Server.Russia]: 'https://www.lowadi.com',
  [Server.Romain]: 'https://www.howrse.ro',
  [Server.USA]: 'https://us.howrse.com',
  [Server.FranceOuranos]: 'https://ouranos.equideow.com',
  [Server.FranceGaia]: 'https://gaia.equideow.com',
  [Server.Sweden]: 'https://www.howrse.se',
}

// BoolToTickConverter
export function boolToTick(value: boolean): string {
  return value ? '✔' : ''
}

// BooleanToVisibilityConverter
// WPF Visibility.Visible/Hidden mapping represented as string for UI logic
export function booleanToVisibility(value: boolean, parameter?: unknown): 'Visible' | 'Hidden' {
  if (parameter == null) {
    return value ? 'Hidden' : 'Visible'
  }
  return value ? 'Visible' : 'Hidden'
}

// EnumValues analogue - returns numeric enum values as number[]
export function enumValues<T extends object>(e: T): number[] {
  // TS compiles number enums to a bi-directional map; filter numeric keys only
  return Object.keys(e)
    .map(k => Number(k))
    .filter(n => !Number.isNaN(n))
}

// EnumValueToDescriptionConverter analogue
// Returns the resource key associated with enum localized description attributes
export function enumValueToDescriptionKey(value: unknown): string | null {
  if (value == null) return null
  // WorkType
  if (typeof value === 'number') {
    // Map known enums to resource keys exactly as in C# attributes
    // WorkType
    if (value in WorkType) {
      switch (value as number) {
        case WorkType.SingleOrder: return 'ModeSingleOrder'
        case WorkType.GlobalOrder: return 'ModeGlobalOrder'
        case WorkType.SingleParallel: return 'ModeSingleParallel'
        case WorkType.GlobalParallel: return 'ModeGlobalParallel'
      }
    }
    // ClientType
    if (value in ClientType) {
      switch (value as number) {
        case ClientType.New: return 'ClientNew'
        case ClientType.Old: return 'ClientOld'
      }
    }
    // ProductType
    if (value in ProductType) {
      switch (value as number) {
        case ProductType.None: return 'None'
        case ProductType.Hay: return 'Hay'
        case ProductType.Oat: return 'Oat'
        case ProductType.Wheat: return 'Wheat'
        case ProductType.Shit: return 'Shit'
        case ProductType.Leather: return 'Leather'
        case ProductType.Apples: return 'Apples'
        case ProductType.Carrot: return 'Carrot'
        case ProductType.Wood: return 'Wood'
        case ProductType.Steel: return 'Steel'
        case ProductType.Sand: return 'Sand'
        case ProductType.Straw: return 'Straw'
        case ProductType.Flax: return 'Flax'
        case ProductType.OR: return 'OR'
      }
    }
    // Server
    if (value in Server) {
      switch (value as number) {
        case Server.Australia: return 'ServerAustralia'
        case Server.England: return 'ServerEngland'
        case Server.Arabic: return 'ServerArabic'
        case Server.Bulgaria: return 'ServerBulgaria'
        case Server.International: return 'ServerInternational'
        case Server.Spain: return 'ServerSpain'
        case Server.Canada: return 'ServerCanada'
        case Server.Germany: return 'ServerGermany'
        case Server.Norway: return 'ServerNorway'
        case Server.Poland: return 'ServerPoland'
        case Server.Russia: return 'ServerRussia'
        case Server.Romain: return 'ServerRomain'
        case Server.USA: return 'ServerUSA'
        case Server.FranceOuranos: return 'ServerFranceOuranos'
        case Server.FranceGaia: return 'ServerFranceGaia'
        case Server.Sweden: return 'ServerSweden'
      }
    }
  }
  return null
}

// AccTypeToContentConverter analogue: returns resource key to be translated
export function accTypeToContentKey(accType: AccountType | null | undefined): string {
  if (accType == null) return 'LoginCoConverter'
  return accType === AccountType.Co ? 'LogoffCoConverter' : 'LoginCoConverter'
}

// AccTypeToStringConverter analogue: returns resource key or empty string
export function accTypeToStringKey(accType: AccountType): string {
  return accType === AccountType.Co ? 'AccTypeString' : ''
}