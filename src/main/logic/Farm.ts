import type { Settings, GlobalSettings } from '@common/types'
import { HorseSex } from '@common/enums'
import { AccountLogic } from './Account'
import { parseDocument } from './Parser'
import { Horse } from './Horse'

export class Farm {
  name: string
  id: string
  acc: AccountLogic
  count: string = ''
  private horses: Horse[] = []
  private babies: Horse[] = []
  private lowHealthCount = 0

  constructor(name: string, id: string, acc: AccountLogic) {
    this.name = name
    this.id = id
    this.acc = acc
  }

  async loadCount(settings: GlobalSettings): Promise<void> {
    const postData = this.id
      ? `go=1&id=${this.id}&chevalType=&chevalEspece=any-all&unicorn=2&pegasus=2&race-cheval=&race-poney=&race-ane=&race-cheval-trait=&race-all=&race-cheval-pegase=&race-poney-pegase=&race-cheval-licorne=&race-poney-licorne=&race-cheval-licorne-ailee=&race-poney-licorne-ailee=&race-cheval-trait-pegase=&race-cheval-trait-licorne=&race-cheval-trait-licorne-ailee=&race-ane-pegase=&race-ane-licorne=&race-ane-licorne-ailee=&chevalTypeRace=&aneRaceId=51&ageComparaison=g&age=0&uniteAge=ans&pierre-philosophale=2&sablier-chronos=2&bras-morphee=2&pommeOr=2&pommeOrDisparue=2&rayonHelios=2&lyre-apollon=2&5th-element=2&fragment=2&jouvence=2&pack-poseidon=2&genetiqueComparaison=g&genetique=0&excellenceComparaison=g&excellence=0&blupComparaison=g&blup=-100&purete=2&sexe=&rall=&r6=&r13=&r1=&r28=&r47=&r43=&r45=&r42=&r35=&r10=&r26=&r39=&r44=&r11=&r7=&r2=&r49=&r5=&r32=&r15=&r31=&r30=&r29=&r40=&r25=&r16=&r46=&r17=&r50=&r22=&r52=&r38=&r24=&r3=&r33=&r51=&r48=&r8=&r14=&r41=&r23=&r9=&r34=&r19=&r27=&r4=&r21=&r12=&gestation=2&nbSaillie=2&hasCompanion=2&chevalNom=&classique=2&western=2&competencesComparaison=g&competences=0&enduranceComparaison=g&endurance=0&vitesseComparaison=g&vitesse=0&dressageComparaison=g&dressage=0&galopComparaison=g&galop=0&trotComparaison=g&trot=0&sautComparaison=g&saut=0&pack-nyx=2&pack-samurai-dragon=2&pack-knight=2&caresse-philotes=2&don-hestia=2&citrouille-ensorcelee=2&sceau-apocalypse=2&chapeau-magique=2&double-face=2&livre-monstres=2&trail-riding-diary=2&haunted-trail-riding-diary=2&greek-trail-riding-diary=2&winter-trail-riding-diary=2&coats-bundle-witch=2&catrina-brooch=2&esprit-nomade=2&diamond-apple=2&pomme-vintage=2&iris-coat=2&button-braided-mane=2&tail-braid-1=2&tail-braid-2=2&clipping=2&parade-apple=2&alexandre-dumas-inkwell=2&arthur-conan-doyle-inkwell=2&heracles-horseshoes=2&sisyphus-boulder=2&selle=&bride=&tapis=&bonnet=&bande=&centreEquestre=2&travaille=2&couche=2&vente=2&search=1&noFilter=1&advanced=0`
      : `go=1&chevalType=&chevalEspece=any-all&unicorn=2&pegasus=2&race-cheval=&race-poney=&race-ane=&race-cheval-trait=&race-all=&race-cheval-pegase=&race-poney-pegase=&race-cheval-licorne=&race-poney-licorne=&race-cheval-licorne-ailee=&race-poney-licorne-ailee=&race-cheval-trait-pegase=&race-cheval-trait-licorne=&race-cheval-trait-licorne-ailee=&race-ane-pegase=&race-ane-licorne=&race-ane-licorne-ailee=&chevalTypeRace=&aneRaceId=51&ageComparaison=g&age=0&uniteAge=ans&pierre-philosophale=2&sablier-chronos=2&bras-morphee=2&pommeOr=2&pommeOrDisparue=2&rayonHelios=2&lyre-apollon=2&5th-element=2&fragment=2&jouvence=2&pack-poseidon=2&genetiqueComparaison=g&genetique=0&excellenceComparaison=g&excellence=0&blupComparaison=g&blup=-100&purete=2&sexe=&rall=&r6=&r13=&r1=&r28=&r47=&r43=&r45=&r42=&r35=&r10=&r26=&r39=&r44=&r11=&r7=&r2=&r49=&r5=&r32=&r15=&r31=&r30=&r29=&r40=&r25=&r16=&r46=&r17=&r50=&r22=&r52=&r38=&r24=&r3=&r33=&r51=&r48=&r8=&r14=&r41=&r23=&r9=&r34=&r19=&r27=&r4=&r21=&r12=&gestation=2&nbSaillie=2&hasCompanion=2&chevalNom=&classique=2&western=2&competencesComparaison=g&competences=0&enduranceComparaison=g&endurance=0&vitesseComparaison=g&vitesse=0&dressageComparaison=g&dressage=0&galopComparaison=g&galop=0&trotComparaison=g&trot=0&sautComparaison=g&saut=0&pack-nyx=2&pack-samurai-dragon=2&pack-knight=2&caresse-philotes=2&don-hestia=2&citrouille-ensorcelee=2&sceau-apocalypse=2&chapeau-magique=2&double-face=2&livre-monstres=2&trail-riding-diary=2&haunted-trail-riding-diary=2&greek-trail-riding-diary=2&winter-trail-riding-diary=2&coats-bundle-witch=2&catrina-brooch=2&esprit-nomade=2&diamond-apple=2&pomme-vintage=2&iris-coat=2&button-braided-mane=2&tail-braid-1=2&tail-braid-2=2&clipping=2&parade-apple=2&alexandre-dumas-inkwell=2&arthur-conan-doyle-inkwell=2&heracles-horseshoes=2&sisyphus-boulder=2&selle=&bride=&tapis=&bonnet=&bande=&centreEquestre=2&travaille=2&couche=2&vente=2&search=1&noFilter=1&advanced=0`
    const html = await this.acc.client.post('/elevage/chevaux/searchHorse', postData)
    const $ = parseDocument(html)
    const scripts = $('script').toArray()
    const last = scripts[scripts.length - 1]
    const txt = $(last).html() || ''
    const m = txt.replace(/\\/g, '').match(/<span style=\"display:inline\" class=\"count\">(.*?)<\/span>/)
    if (m) {
      const raw = m[1].trim()
      this.count = raw.substring(1, raw.length - 1)
    }
  }

  async loadHorses(settings: Settings, global: GlobalSettings): Promise<void> {
    this.horses = []
    let postDataBase = ''
    if (settings.LoadSleep) {
      postDataBase = this.id
        ? `go=1&id=${this.id}&sort=${global.Sort}&filter=all`
        : `go=1&sort=${global.Sort}&filter=all`
    } else {
      const filter = [
        'chevalType=',
        'chevalEspece=any-all',
        'unicorn=2',
        'pegasus=2',
        'race-cheval=', 'race-poney=', 'race-ane=', 'race-cheval-trait=', 'race-all=', 'race-cheval-pegase=', 'race-poney-pegase=', 'race-cheval-licorne=', 'race-poney-licorne=', 'race-cheval-licorne-ailee=', 'race-poney-licorne-ailee=', 'race-cheval-trait-pegase=', 'race-cheval-trait-licorne=', 'race-cheval-trait-licorne-ailee=', 'race-ane-pegase=', 'race-ane-licorne=', 'race-ane-licorne-ailee=',
        'chevalTypeRace=', 'aneRaceId=51',
        'ageComparaison=g', 'age=0', 'uniteAge=ans',
        'pierre-philosophale=2', 'sablier-chronos=2', 'bras-morphee=2', 'pommeOr=2', 'pommeOrDisparue=2', 'rayonHelios=2', 'lyre-apollon=2', '5th-element=2', 'fragment=2', 'jouvence=2', 'pack-poseidon=2',
        'genetiqueComparaison=g', 'genetique=0', 'excellenceComparaison=g', 'excellence=0', 'blupComparaison=g', 'blup=-100', 'purete=2',
        'sexe=', 'rall=', 'r6=', 'r13=', 'r1=', 'r28=', 'r47=', 'r43=', 'r45=', 'r42=', 'r35=', 'r10=', 'r26=', 'r39=', 'r44=', 'r11=', 'r7=', 'r2=', 'r49=', 'r5=', 'r32=', 'r15=', 'r31=', 'r30=', 'r29=', 'r40=', 'r25=', 'r16=', 'r46=', 'r17=', 'r50=', 'r22=', 'r52=', 'r38=', 'r24=', 'r3=', 'r33=', 'r51=', 'r48=', 'r8=', 'r14=', 'r41=', 'r23=', 'r9=', 'r34=', 'r19=', 'r27=', 'r4=', 'r21=', 'r12=',
        'gestation=2', 'nbSaillie=2', 'hasCompanion=2', 'chevalNom=',
        'classique=2', 'western=2', 'competencesComparaison=g', 'competences=0', 'enduranceComparaison=g', 'endurance=0', 'vitesseComparaison=g', 'vitesse=0', 'dressageComparaison=g', 'dressage=0', 'galopComparaison=g', 'galop=0', 'trotComparaison=g', 'trot=0', 'sautComparaison=g', 'saut=0',
        'pack-nyx=2', 'pack-samurai-dragon=2', 'pack-knight=2', 'caresse-philotes=2', 'don-hestia=2', 'citrouille-ensorcelee=2', 'sceau-apocalypse=2', 'chapeau-magique=2', 'double-face=2', 'livre-monstres=2', 'trail-riding-diary=2', 'haunted-trail-riding-diary=2', 'greek-trail-riding-diary=2', 'winter-trail-riding-diary=2', 'coats-bundle-witch=2', 'catrina-brooch=2', 'esprit-nomade=2', 'diamond-apple=2', 'pomme-vintage=2', 'iris-coat=2', 'button-braided-mane=2', 'tail-braid-1=2', 'tail-braid-2=2', 'clipping=2', 'parade-apple=2', 'alexandre-dumas-inkwell=2', 'arthur-conan-doyle-inkwell=2', 'heracles-horseshoes=2', 'sisyphus-boulder=2',
        'selle=', 'bride=', 'tapis=', 'bonnet=', 'bande=', 'centreEquestre=2', 'travaille=2', 'couche=2', 'vente=2', 'search=1', 'noFilter=1', 'advanced=1'
      ].join('&')
      postDataBase = this.id
        ? `go=1&id=${this.id}&sort=${global.Sort}&filter=all&${filter}`
        : `go=1&sort=${global.Sort}&filter=all&${filter}`
    }

    // initial page
    let html = await this.acc.client.post('/elevage/chevaux/searchHorse', postDataBase)
    let $ = parseDocument(html)
    const pages = $('.pageNumbering')
    const parsePage = () => {
      const links = $('.horsename')
      links.each((_, el) => {
        const href = $(el).attr('href') || ''
        const id = href.split('=')[1]
        const name = $(el).text()
        this.horses.push(new Horse(id, name, this.acc))
      })
    }
    parsePage()

    if (pages.length > 0) {
      const lastAnchor = $('.pageNumbering li a').last()
      const rel = lastAnchor.attr('rel')
      const finalAnchor = rel ? $('.pageNumbering li a').eq($('.pageNumbering li a').length - 2) : lastAnchor
      const last = Number(finalAnchor.attr('data-page') || '0') + 1
      for (let i = 0; i <= last; i++) {
        const pd = postDataBase + (postDataBase.includes('startingPage=') ? '' : `&startingPage=${i}`)
        html = await this.acc.client.post('/elevage/chevaux/searchHorse', pd)
        $ = parseDocument(html)
        parsePage()
      }
    }
    this.count = this.horses.length.toString()
  }

  private async pause(randomPause: boolean): Promise<void> {
    if (!randomPause) return
    const ms = Math.floor(Math.random() * (100 - 50)) + 50
    await new Promise((r) => setTimeout(r, ms))
  }

  private async checkFood(quantity: string, buyInt: number, productKey: keyof AccountLogic['products']): Promise<void> {
    const prod = this.acc.products[productKey]
    if (!prod) return
    if (quantity !== '' && prod.amount < 100) {
      if (this.acc.equ < buyInt) {
        // ensure funds by selling main/sub product if configured
        await this.acc.ensureFunds(buyInt)
        await this.acc.loadProducts()
      }
      await this.acc.buy(prod, quantity)
      // fire and forget refresh
      this.acc.loadProducts().catch(() => {})
    }
  }

  private async horseRun(horse: Horse, settings: Settings, global: GlobalSettings): Promise<void> {
    let $ = await horse.getDoc()
    if ($('#tab-gift-title').length === 0 && $('.h2').length === 0 && $('#poulain-1').length === 0) {
      horse.loadInfo($)
    }
    const ok = await horse.checkHorse($, settings)
    if (!ok) return

    if (horse.health > Number(settings.HealthEdge)) {
      if (horse.health <= 30) this.lowHealthCount++

      if (horse.age >= 6 && $('#cheval-inscription').length) {
        if (settings.ReserveID !== '' || settings.SelfReserve) await horse.centreReserve(settings)
        else await horse.centre('0', settings)
        $ = await horse.getDoc()
      }
      await this.pause(global.RandomPause)

      if (horse.sex === HorseSex.Female && $('#lienVeterinaire').length) {
        const html = await horse.birth(settings)
        if (settings.GoBabies) {
          const $$ = parseDocument(html)
          const scripts = $$('.content__middle script').toArray()
          let script = ''
          for (const s of scripts) { const h = $$(s).html() || ''; if (h.includes('var chevalId')) { script = h; break } }
          const idMatch = script.match(/var chevalId = (.*?);/)
          const id = idMatch ? idMatch[1] : ''
          if (id) this.babies.push(new Horse(id, '', this.acc))
        }
        $ = await horse.getDoc()
        horse.loadInfo($)
      }
      await this.pause(global.RandomPause)

      await horse.groom($)
      await this.pause(global.RandomPause)

      if (settings.Mission && horse.age >= 24 && horse.energy - 30 > 20 && $('#mission-tab-0').length) {
        if ((settings.MissionOld && horse.age >= 336) || horse.age < 336) {
          const missionBtn = $('#mission-tab-0 a').first()
          if (!missionBtn.attr('class')?.includes('action-disabled')) await horse.mission()
        }
      }

      await this.pause(global.RandomPause)

      if (horse.age >= 30 && horse.energy - 25 > 20) {
        if (horse.sex === HorseSex.Male && settings.HorsingMale && $('#reproduction-tab-0').length && !$('#reproduction-tab-0 a').last().attr('class')?.includes('action-disable')) {
          await horse.horsingMale($, settings)
        } else if (horse.sex === HorseSex.Female && settings.HorsingFemale) {
          await horse.horsingFemale($, settings)
        }
      }

      await this.pause(global.RandomPause)

      // Auto-buy food if configured
      const buyHayInt = settings.BuyHay !== '' ? Number(settings.BuyHay) * 2 + 100 : 0
      const buyOatInt = settings.BuyOat !== '' ? Number(settings.BuyOat) * 2 + 100 : 0
      if (buyHayInt > 0) await this.checkFood(settings.BuyHay, buyHayInt, 'Hay')
      if (buyOatInt > 0) await this.checkFood(settings.BuyOat, buyOatInt, 'Oat')

      await this.pause(global.RandomPause)

      $ = await horse.getDoc()
      await horse.feeding($)
      await this.pause(global.RandomPause)

      $ = await horse.getDoc()
      if (settings.Stroke) await horse.stroke($)
      await horse.sleep($)
      // refresh products async
      this.acc.loadProducts().catch(() => {})
    } else {
      this.lowHealthCount++
    }
  }

  async run(global: GlobalSettings, signal: AbortSignal): Promise<void> {
    // load horses according to account settings
    await this.loadHorses(this.acc.settings, global)

    // skip first N as per SkipIndex
    const skip = Math.max(0, this.acc.settings.SkipIndex - 1)
    const queue = this.horses.slice(skip)

    // iterate with optional parallelism
    const concurrency = global.ParallelHorse ? 5 : 1
    let running = 0
    let index = 0
    const next = async (): Promise<void> => {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
      if (index >= queue.length) return
      const horse = queue[index++]
      running++
      try {
        await this.horseRun(horse, this.acc.settings, global)
      } finally {
        running--
        await next()
      }
    }

    const starters = Array.from({ length: Math.min(concurrency, queue.length) }, () => next())
    await Promise.all(starters)

    // babies processing if enabled
    if (this.acc.settings.GoBabies && this.babies.length) {
      const babiesQueue = this.babies.slice()
      const runBaby = async () => {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
        const b = babiesQueue.shift()
        if (!b) return
        await this.horseRun(b, this.acc.settings, global)
        await runBaby()
      }
      const workers = Array.from({ length: Math.min(5, babiesQueue.length) }, () => runBaby())
      await Promise.all(workers)
    }
  }
}