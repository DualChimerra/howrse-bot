#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { parseStringPromise } = require('xml2js')

function read(p){ return fs.readFileSync(p,'utf8') }
function write(p, data){ fs.writeFileSync(p, data) }

async function resxToJson(resxPath) {
  const xml = read(resxPath)
  const obj = await parseStringPromise(xml)
  const data = obj.root?.data || []
  const map = {}
  for (const d of data) {
    const key = d.$?.name
    if (!key) continue
    const val = (d.value && d.value[0] !== undefined) ? String(d.value[0]) : ''
    map[key] = val
  }
  return map
}

async function main() {
  const root = process.cwd()
  const ruResx = path.join(root, 'BotQually', 'Properties', 'Resources.resx')
  const enResx = path.join(root, 'BotQually', 'Properties', 'Resources.en.resx')
  const outDir = path.join(root, 'src', 'renderer', 'i18n')
  const ruJsonPath = path.join(outDir, 'ru.json')
  const enJsonPath = path.join(outDir, 'en.json')

  const ru = await resxToJson(ruResx)
  const en = await resxToJson(enResx)

  write(ruJsonPath, JSON.stringify(ru, null, 2))
  write(enJsonPath, JSON.stringify(en, null, 2))
  console.log('i18n synced from .resx → ru.json/en.json')
}

main().catch(e=>{ console.error(e); process.exit(1) })