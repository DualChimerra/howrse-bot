import { load, CheerioAPI } from 'cheerio'

export function parseDocument(html: string): CheerioAPI {
  return load(html)
}

export function parseDocumentFromJson(json: string, selector: string): CheerioAPI {
  const data = JSON.parse(json)
  const html = data[selector] as string
  return load(html)
}