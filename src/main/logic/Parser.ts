import { parseHTML } from 'linkedom'

export function parseDocument(html: string) {
  const { document } = parseHTML(html)
  return document
}

export function parseDocumentFromJson(json: string, selector: string) {
  const data = JSON.parse(json)
  const html = data[selector] as string
  const { document } = parseHTML(html)
  return document
}