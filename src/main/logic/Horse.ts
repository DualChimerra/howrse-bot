import type { IClient } from '../http/IClient'
import { parseDocument, parseDocumentFromJson } from './Parser'
import type { CheerioAPI } from 'cheerio'
import { HorseSex, ProductType } from '@common/enums'
import type { Settings } from '@common/types'
import { AccountLogic } from './Account'

function randInt(minInclusive: number, maxExclusive: number): number {
  return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive
}

export class Horse {
  id: string
  name: string
  private acc: AccountLogic

  // runtime state loaded from page
  health: number = 0
  energy: number = 0
  age: number = 0
  sex: HorseSex = HorseSex.Male

  constructor(id: string, name: string, acc: AccountLogic) {
    this.id = id
    this.name = name
    this.acc = acc
  }

  async getDoc(): Promise<CheerioAPI> {
    const html = await this.acc.client.get(`/elevage/chevaux/cheval?id=${this.id}`)
    return parseDocument(html)
  }

  loadInfo($: CheerioAPI) {
    const scripts = $('.content__middle script').toArray()
    let script = ''
    for (const el of scripts) {
      const h = $(el).html() || ''
      if (h.includes('var chevalId')) { script = h; break }
    }
    const ageMatch = script.match(/var chevalAge = (.*?);/)
    if (ageMatch) this.age = Number(ageMatch[1])
    const sexMatch = script.match(/var chevalSexe = (.*?);/)
    if (sexMatch) {
      const raw = sexMatch[1].trim().replace(/^['"]|['"]$/g, '')
      this.sex = raw === 'feminin' ? HorseSex.Female : HorseSex.Male
    }
    const energyText = ($('#energie').text() || '').trim()
    const healthText = ($('#sante').text() || '').trim()
    if (energyText) this.energy = Number(energyText)
    if (healthText) this.health = Number(healthText)
  }

  private parseForm($: CheerioAPI, formId: string): string {
    const form = $(`#${formId}`)
    if (!form.length) return ''
    const inputs = form.find('input').toArray()
    if (inputs.length < 2) return ''

    const name1 = ($(inputs[0]).attr('name') || '').toLowerCase()
    const value1 = ($(inputs[0]).attr('value') || '').toLowerCase()

    if (formId === 'form-do-eat-treat-carotte') {
      return `${name1}=${value1}&id=${this.id}&friandise=carrote`
    }

    let postData = `${name1}=${value1}`

    const name2Full = ($(inputs[1]).attr('name') || '')
    const name2 = name2Full.substring(formId.length).toLowerCase()
    postData += `&${name2}=${this.id}`

    if (formId !== 'form-do-suckle' && inputs.length >= 4) {
      const name3Full = ($(inputs[2]).attr('name') || '')
      const name4Full = ($(inputs[3]).attr('name') || '')
      const name3 = name3Full.substring(formId.length).toLowerCase()
      const name4 = name4Full.substring(formId.length).toLowerCase()
      postData += `&${name3}=${randInt(20, 60)}&${name4}=${randInt(20, 60)}`
    }

    return postData
  }

  async action($: CheerioAPI, formId: string, selector: string, action: string): Promise<string> {
    const btn = $(selector)
    if (!btn.length) return ''
    const cls = (btn.attr('class') || '')
    if (cls.includes('action-disabled')) return ''
    const postData = this.parseForm($, formId)
    if (!postData) return ''
    const answer = await this.acc.client.post(`/elevage/chevaux/${action}`, postData)
    return answer
  }

  async mission(): Promise<void> {
    await this.acc.client.post('/elevage/chevaux/doCentreMission', `id=${this.id}`)
    this.energy = Math.max(0, this.energy - 30)
  }

  private parseFood($: CheerioAPI, foodType: 'hay' | 'oats'): { foodName: string, foodFinal: number } {
    let quantityText = ''
    if (foodType === 'hay') {
      quantityText = $('.float-right.section-fourrage.section-fourrage-quantity').first().text().trim()
    } else {
      quantityText = $('.float-right.section-avoine.section-avoine-quantity').first().text().trim()
    }
    let [givenStr, toGiveStr] = quantityText.split('/')
    const sliderName = $(`#${foodType}Slider-sliderHidden`).attr('name') || ''
    const foodName = sliderName.substring(7).toLowerCase()

    const feedForm = $('#feeding')
    if (foodType === 'hay' && feedForm.find('div').first().attr('id') === 'messageBoxInline') {
      const html = feedForm.find('div').first().html() || ''
      if (html.includes('20')) toGiveStr = '20'
      else if (!html.includes('20')) toGiveStr = '0'
    }
    const foodGiven = Number((givenStr || '0').trim() || 0)
    const foodGive = Number((toGiveStr || '0').trim() || 0)
    let foodFinal = foodGive - foodGiven
    if (foodFinal < 0) foodFinal = 0
    return { foodName, foodFinal }
  }

  async feeding($: CheerioAPI): Promise<void> {
    if (this.age < 6) {
      await this.action($, 'form-do-suckle', '#boutonAllaiter', 'doSuckle')
      return
    }
    if (this.age < 18) {
      const { foodName: hayName, foodFinal: hay } = this.parseFood($, 'hay')
      const base = this.parseForm($, 'feeding')
      if (hay !== 0) {
        const postData = `${base}&${hayName}=${hay}`
        await this.acc.client.post('/elevage/chevaux/doEat', postData)
      }
      return
    }
    // adult
    const { foodName: hayName, foodFinal: hay } = this.parseFood($, 'hay')
    const { foodName: oatName, foodFinal: oat } = this.parseFood($, 'oats')
    if (hay !== 0 || oat !== 0) {
      const base = this.parseForm($, 'feeding')
      const postData = `${base}&${hayName}=${hay}&${oatName}=${oat}`
      await this.acc.client.post('/elevage/chevaux/doEat', postData)
    }
  }

  async groom($: CheerioAPI): Promise<void> {
    await this.action($, 'form-do-groom', '#boutonPanser', 'doGroom')
  }

  async drink($: CheerioAPI): Promise<void> {
    await this.action($, 'form-do-drink', '#boutonBoire', 'doDrink')
  }

  async stroke($: CheerioAPI): Promise<void> {
    await this.action($, 'form-do-stroke', '#boutonCaresser', 'doStroke')
  }

  async sleep($: CheerioAPI): Promise<void> {
    await this.action($, 'form-do-night', '#boutonCoucher', 'doNight')
  }

  static lastPageNumber($: CheerioAPI): number {
    const anchors = $('.pageNumbering a[data-page]')
    if (!anchors.length) return 1
    const last = anchors.last()
    const dp = Number(last.attr('data-page') || '0')
    return dp + 1
  }

  private durationToTarif(duration: string): number {
    switch (duration) {
      case '1': return 1
      case '3': return 2
      case '10': return 3
      case '30': return 4
      case '60': return 5
      default: return 2
    }
  }

  async centre(competence: string, settings: Settings): Promise<void> {
    let answer = ''
    do {
      await this.moneyCheck(settings)
      const fourrage = settings.CentreHay ? '1' : '2'
      const avoine = settings.CentreOat ? '1' : '2'
      const selectTarif = this.durationToTarif(settings.CentreDuration)
      let postData = `cheval=${this.id}&elevage=&cheval=${this.id}&competence=${competence}&tri=tarif${selectTarif}&sens=ASC&tarif=&leconsPrix=&foret=2&montagne=2&plage=2&classique=2&western=2&fourrage=${fourrage}&avoine=${avoine}&carotte=2&mash=2&hasSelles=2&hasBrides=2&hasTapis=2&hasBonnets=2&hasBandes=2&abreuvoir=2&douche=2&centre=&centreBox=0&directeur=&prestige=&bonus=&boxType=&boxLitiere=&prePrestige=&prodSelles=&prodBrides=&prodTapis=&prodBonnets=&prodBandes=`
      let json = ''
      do {
        json = await this.acc.client.post('/elevage/chevaux/centreSelection', postData)
      } while (!json.includes('{"content":'))
      let $doc = parseDocumentFromJson(json, 'content')
      const scripts = $doc('#table-0 tbody tr').first().find('script').toArray()
      for (const sc of scripts) {
        const h = $doc(sc).html() || ''
        if (h.includes(`duree=${settings.CentreDuration}&elevage=`)) {
          const m = h.match(/\{'params': '(.*?)'\}/)
          if (m) postData = m[1]
        }
      }
      answer = await this.acc.client.post('/elevage/chevaux/doCentreInscription', postData)
    } while (!answer.includes('message=centreOk'))
  }

  private scriptSearch($doc: CheerioAPI, centreId: string, settings: Settings): string {
    let postData = ''
    const scripts = $doc('#table-0 tbody').first().find('script').toArray()
    for (const el of scripts) {
      const h = $doc(el).html() || ''
      if (h.includes(`id=${this.id}&centre=${centreId}`) && h.includes(`duree=${settings.ReserveDuration}`)) {
        const m = h.match(/\{'params': '(.*?)'\}/)
        if (m) { postData = m[1]; break }
      }
    }
    return postData
  }

  async centreReserve(settings: Settings): Promise<void> {
    let answer = ''
    do {
      await this.moneyCheck(settings)
      let centreId = settings.ReserveID
      if (settings.SelfReserve) {
        const html = await this.acc.client.get('/centre/bureau/')
        const $ = parseDocument(html)
        const href = $('#page-contents .action.action-style-2').first().attr('href') || ''
        centreId = href.split('&')[0].split('=')[1]
      }
      const selectTarif = this.durationToTarif(settings.ReserveDuration)
      let payload = await this.acc.client.post('/elevage/chevaux/boxReserveSelection', `cheval=${this.id}&tri=tarif${selectTarif}&sens=ASC&cheval=${this.id}`)
      try {
        const obj = JSON.parse(payload)
        if (obj.hasBox) {
          let $doc = parseDocumentFromJson(payload, 'content')
          let postData = ''
          if ($doc('.pageNumbering').length > 0) {
            const last = Horse.lastPageNumber($doc)
            for (let i = 0; i < last; i++) {
              const pageJson = await this.acc.client.post('/elevage/chevaux/boxReserveSelection', `cheval=${this.id}&tri=tarif${selectTarif}&sens=ASC&cheval=${this.id}&page=${i}`)
              $doc = parseDocumentFromJson(pageJson, 'content')
              postData = this.scriptSearch($doc, centreId, settings)
              if (postData) break
            }
          } else {
            postData = this.scriptSearch($doc, centreId, settings)
          }
          if (postData) {
            answer = await this.acc.client.post('/elevage/chevaux/doCentreInscription', postData)
          } else {
            answer = '0'
          }
        } else {
          answer = '0'
        }
      } catch {
        answer = '0'
      }
    } while (!answer.includes('message=centreOk') && answer !== '0')

    if (answer.includes('message=centreOk')) {
      if (settings.Continue) await this.centreExtend(settings)
    }
    if (answer === '0' && settings.WriteToAll) {
      await this.centre('0', settings)
    }
  }

  async centreExtend(settings: Settings): Promise<void> {
    await this.acc.client.post('/elevage/chevaux/doCenterExtends', `id=${this.id}&duration=${settings.ContinueDuration}`)
  }

  private async moneyCheck(settings: Settings): Promise<void> {
    let min = 0
    switch (settings.CentreDuration) {
      case '1': min = 200; break
      case '3': min = 600; break
      case '10': min = 2000; break
      case '30': min = 6000; break
      case '60': min = 12000; break
    }
    if (this.acc.equ < min + 100) {
      await this.acc.ensureFunds(min + 100)
    }
  }

  async birth(settings: Settings): Promise<string> {
    const maleName = settings.MaleName
    const femaleName = settings.FemaleName
    await this.acc.client.get(`/elevage/chevaux/mettreBas?jument=${this.id}`)
    const html = await this.acc.client.get(`/elevage/chevaux/choisirNoms?jument=${this.id}`)
    const $ = parseDocument(html)

    let affixValue = ''
    $('#affixe-1 option').each((_, el) => {
      if ($(el).text().trim() === settings.Affix) {
        affixValue = $(el).attr('value') || ''
      }
    })

    let farmValue = ''
    $('#elevage-1 option').each((_, el) => {
      if (!$(el).attr('disabled')) {
        if ($(el).text().trim() === settings.Farm) {
          farmValue = $(el).attr('value') || ''
        }
      }
    })

    const sex = $('.form-select-name img').first().attr('alt')
    const name = sex === 'male' ? maleName : femaleName
    const postData = `valider=ok&poulain-1=${encodeURIComponent(name)}&affixe-1=${encodeURIComponent(affixValue)}&elevage-1=${encodeURIComponent(farmValue)}`
    let answer = ''
    do {
      answer = await this.acc.client.post(`/elevage/chevaux/choisirNoms?jument=${this.id}`, postData)
    } while (!answer.includes('<!DOCTYPE html>'))
    return answer
  }

  private async horsingCycle(postData: string): Promise<void> {
    while (this.energy - 25 > 20) {
      await this.acc.client.post('/elevage/chevaux/reserverJument', postData)
      this.energy = Math.max(0, this.energy - 25)
    }
  }

  async horsingMale($: CheerioAPI, settings: Settings): Promise<void> {
    this.energy = Number(($('#energie').text() || '0').trim())
    const postData = settings.HorsingMaleCommand
      ? `id=${this.id}&action=save&type=equipe&price=0&owner=&nom=`
      : `id=${this.id}&action=save&type=public&price=${settings.HorsingMalePrice}&owner=&nom=`

    await this.horsingCycle(postData)
    await this.action($, 'form-do-stroke', '#boutonCaresser', 'doStroke')
    if (settings.Carrot) {
      await this.action($, 'form-do-eat-treat-carotte', '#boutonCarotte', 'doEatTreat')
    }
    await this.action($, 'form-do-drink', '#boutonBoire', 'doDrink')
    const $new = await this.getDoc()
    this.energy = Number(($new('#energie').text() || '0').trim())
    await this.horsingCycle(postData)
  }

  private async horsingFemaleSettings(settings: Settings, $: CheerioAPI): Promise<string> {
    let raceIndex = ''
    const gp = settings.HorsingFemaleCommand ? settings.GPEdge : '0'
    const type = settings.HorsingFemaleCommand ? 'equipe' : 'public'
    const blood = settings.ClearBlood
    const price = settings.HorsingFemaleCommand ? '0' : settings.HorsingFemalePrice
    let breeder = settings.Breeder
    const race = $('#characteristics-body-content a').first().text().trim()

    if (settings.SelfMale) {
      breeder = this.acc.login
    }

    let purete = '2'
    if (blood) {
      purete = '1'
      const html = await this.acc.client.get(`/elevage/chevaux/rechercherMale?jument=${this.id}`)
      const $r = parseDocument(html)
      const options = $r('#race option')
      let num = 0
      options.each((i, el) => { if ($r(el).text().trim() === race) num = i })
      raceIndex = options.eq(num).attr('value') || ''
    }

    if (settings.HorsingFemaleCommand) {
      return `tri=cTotal&page=0&sens=DESC&rechercher=1&breeder=${encodeURIComponent(breeder)}&potentielTotal=${gp}&prix=0&blup=-100&race=${raceIndex}&purete=${purete}&cE=0&cV=0&cD=0&cG=0&cT=0&cS=0&cheval=1&poney=1&pegase=1&=1&potentielTotalC=l&jument=${this.id}&type=${type}`
    }
    return `tri=cTotal&page=0&sens=DESC&rechercher=1&breeder=${encodeURIComponent(breeder)}&potentielTotal=${gp}&prix=${price}&blup=-100&race=${raceIndex}&purete=${purete}&cE=0&cV=0&cD=0&cG=0&cT=0&cS=0&cheval=1&poney=1&pegase=1&=1&prixC=l&jument=${this.id}&type=${type}`
  }

  async horsingFemale($: CheerioAPI, settings: Settings): Promise<void> {
    try {
      const tabs = $('#reproduction-tab-0 a')
      if (tabs.length > 0) {
        const reproduction = tabs.last()
        if (reproduction.attr('id') !== 'boutonEchographie' && !(reproduction.attr('class') || '').includes('disabled')) {
          if (!$('#tab-description').length && $('#reproduction > .message').length === 0) {
            let answer = ''
            do {
              const horsingFemalePrice = Number(settings.HorsingFemalePrice) + 100
              if (this.acc.equ < horsingFemalePrice) {
                await this.acc.ensureFunds(horsingFemalePrice)
              }
              const searchString = await this.horsingFemaleSettings(settings, $)
              do {
                let docHtml = await this.acc.client.get(`/elevage/chevaux/rechercherMale?${searchString}`)
                let $doc = parseDocument(docHtml)
                const refs = $doc('.align-center.action a')
                if (refs.length > 0) {
                  const idx = randInt(0, Math.max(1, refs.length))
                  const action = refs.eq(idx).attr('href') || ''
                  const pageHtml = await this.acc.client.get(action)
                  $doc = parseDocument(pageHtml)
                  const script = $doc('#page-contents script').last().html() || ''
                  if (!script.includes('return window.location')) {
                    let pd = script.substring(script.indexOf('params') + 9)
                    pd = pd.substring(0, pd.length - 16)
                    answer = await this.acc.client.post('/elevage/chevaux/doReproduction', pd)
                  } else {
                    answer = '1'
                  }
                } else {
                  answer = '1'
                }
              } while (answer.includes('\"errors\":[\"internal\"]'))
            } while (answer.includes('saillieArgent') || (!answer.includes('?id=') && answer !== '1'))
          }
        }
      }
    } catch {
      // swallow errors; upstream logger/notifications handled in UI layer
    }
  }

  async checkHorse($: CheerioAPI, settings: Settings): Promise<boolean> {
    const history = $('.spacer-small-bottom.button.button-style-0')
    if ($('.h2').length !== 0) {
      await this.acc.client.get(`/elevage/chevaux/paradis?id=${this.id}`)
      return false
    } else if ($('#tab-gift-title').length) {
      return false
    } else if ($('#poulain-1').length) {
      const formAction = $('form').first().attr('action') || ''
      const mom = formAction.substring(35)
      const sex = $('.form-select-name img').first().attr('alt')
      const littleHorse = sex === 'male' ? settings.MaleName : settings.FemaleName
      const postData = `valider=ok&poulain-1=${encodeURIComponent(littleHorse)}&affixe-1=&elevage-1=`
      await this.acc.client.post(`/elevage/chevaux/choisirNoms?jument=${mom}`, postData)
      return false
    } else if ($('#vieillissement-head-title').length || (!settings.OldHorses && this.age >= 360) || $('#annulation').length || history.length > 0) {
      return false
    } else if (this.age >= 360 && !settings.OldHorses) {
      return false
    } else {
      return true
    }
  }
}