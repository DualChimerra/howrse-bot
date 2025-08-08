import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { parseStringPromise } from 'xml2js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const RU_RESX = resolve(__dirname, '../BotQually/Properties/Resources.resx')
const EN_RESX = resolve(__dirname, '../BotQually/Properties/Resources.en.resx')
const RU_OUT = resolve(__dirname, '../src/renderer/i18n/ru.json')
const EN_OUT = resolve(__dirname, '../src/renderer/i18n/en.json')

async function resxToJson(inPath, outPath) {
  const xml = readFileSync(inPath, 'utf-8')
  const doc = await parseStringPromise(xml)
  const data = doc.root?.data || []
  const obj = {}
  for (const item of data) {
    const attrs = item.$ || {}
    const name = attrs.name
    const type = attrs.type
    if (!name) continue
    // only string values; skip non-string typed entries (e.g., icons)
    if (type) continue
    const valueNode = item.value?.[0]
    if (typeof valueNode === 'string') {
      obj[name] = valueNode
    } else if (valueNode?._) {
      obj[name] = valueNode._
    }
  }
  // Write pretty JSON with stable key order
  const sorted = Object.keys(obj).sort().reduce((acc, k) => { acc[k] = obj[k]; return acc }, {})
  writeFileSync(outPath, JSON.stringify(sorted, null, 2), 'utf-8')
}

await resxToJson(RU_RESX, RU_OUT)
await resxToJson(EN_RESX, EN_OUT)

console.log('Generated:', RU_OUT, EN_OUT)