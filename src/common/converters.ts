import { Server } from './enums'

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