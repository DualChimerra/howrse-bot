import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<any>({})
  const [scope, setScope] = useState<'global'|'single'>('global')

  useEffect(() => { (async () => {
    const s = await window.api.state.get();
    const wt = s.globalSettings?.WorkType ?? 0
    const selectedIdx = s.selected ?? -1
    const useSingle = (wt === 0 || wt === 2) && selectedIdx >= 0
    setScope(useSingle ? 'single' : 'global')
    if (useSingle) {
      const acc = s.accounts[selectedIdx]
      setSettings(acc?.PrivateSettings || acc?.Settings || defaultSettings())
    } else {
      setSettings((s.globalSettings||{}).Settings || defaultSettings())
    }
  })() }, [])

  const upd = (patch: any) => setSettings((s: any) => ({ ...s, ...patch }))

  const productOptions = [
    { value: 1, key: 'Hay' },
    // { value: 2, key: 'Oat' }, // excluded
    { value: 3, key: 'Wheat' },
    // { value: 4, key: 'Shit' }, // excluded
    { value: 5, key: 'Leather' },
    { value: 6, key: 'Apples' },
    { value: 7, key: 'Carrot' },
    { value: 8, key: 'Wood' },
    { value: 9, key: 'Steel' },
    { value: 10, key: 'Sand' },
    { value: 11, key: 'Straw' },
    { value: 12, key: 'Flax' },
    // { value: 13, key: 'OR' }, // excluded
  ]

  function defaultSettings() {
    return {
      HorsingFemale: false,
      HorsingFemalePrice: '500',
      Breeder: '',
      ClearBlood: false,
      SelfMale: false,
      BuyWheat: false,
      HorsingFemaleCommand: false,
      GPEdge: '1000',
      HorsingMale: false,
      HorsingMaleCommand: false,
      HorsingMalePrice: '500',
      Carrot: false,
      MaleName: 'Муж',
      FemaleName: 'Жен',
      Affix: '',
      Farm: '',
      RandomNames: false,
      CentreDuration: '3',
      CentreHay: false,
      CentreOat: false,
      ReserveID: '',
      ReserveDuration: '',
      ContinueDuration: '',
      SelfReserve: false,
      WriteToAll: false,
      Continue: false,
      BuyHay: '500',
      BuyOat: '500',
      MainProductToSell: 3, // Wheat
      SubProductToSell: 0, // None
      SellShit: false,
      Mission: false,
      OldHorses: false,
      HealthEdge: '0',
      SkipIndex: 0,
      LoadSleep: true,
      GoBabies: false,
      Stroke: false,
      MissionOld: false,
      Sharing: false,
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <section className="bg-card p-3 rounded-xl">
        <div className="font-semibold mb-2">{t('SettingsPageHorsingFemaleText')}</div>
        <div className="space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.HorsingFemale} onChange={e=>upd({ HorsingFemale: e.target.checked })}/> {t('SettingsPageTurnOnFemaleChk')}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.ClearBlood} onChange={e=>upd({ ClearBlood: e.target.checked })}/> {t('SettingsPageCleanBloodChk')}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.SelfMale} onChange={e=>upd({ SelfMale: e.target.checked })}/> {t('SettingsPageSelfMaleChk')}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.BuyWheat} onChange={e=>upd({ BuyWheat: e.target.checked })}/> {t('SettingsPageBuyWheatChk')}</label>
          <div className="text-center">{t('SettingsPageBuyBelowText')}</div>
          <select className="w-full" value={settings.HorsingFemalePrice || '500'} onChange={e=>upd({ HorsingFemalePrice: e.target.value })}>
            {[500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6500,7000,7500].map(v=> <option key={v}>{v}</option>)}
          </select>
          <div className="text-center mt-2">{t('SettingsPageFarmerText')}</div>
          <input className="w-full" value={settings.Breeder || ''} onChange={e=>upd({ Breeder: e.target.value })} />
        </div>
      </section>

      <section className="bg-card p-3 rounded-xl space-y-2">
        <div className="font-semibold">{t('SettingsPageHorsingFemaleText2')}</div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.HorsingFemaleCommand} onChange={e=>upd({ HorsingFemaleCommand: e.target.checked })}/> {t('SettingsPageTeamChk')}</label>
        <div className="flex items-center gap-2">
          <div>{t('SettingsPageGPBelowText')}</div>
          <input className="w-24" value={settings.GPEdge || ''} onChange={e=>upd({ GPEdge: e.target.value })} />
        </div>
        <div className="font-semibold mt-2">{t('SettingsPageHorsingMaleText')}</div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.HorsingMale} onChange={e=>upd({ HorsingMale: e.target.checked })}/> {t('SettingsPageTurnOnMaleChk')}</label>
        <div>{t('SettingsPagePriceText')}</div>
        <select className="w-full" value={settings.HorsingMalePrice || '500'} onChange={e=>upd({ HorsingMalePrice: e.target.value })}>
          {[500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6500,7000,7500].map(v=> <option key={v}>{v}</option>)}
        </select>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.Carrot} onChange={e=>upd({ Carrot: e.target.checked })}/> {t('SettingsPageCarrotChk')}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.HorsingMaleCommand} onChange={e=>upd({ HorsingMaleCommand: e.target.checked })}/> {t('SettingsPageToTeamChk')}</label>
      </section>

      <section className="bg-card p-3 rounded-xl space-y-2">
        <div className="font-semibold">{t('SettingsPageBabiesText')}</div>
        <div>{t('SettingsPageMaleNameText')}</div>
        <input className="w-full" value={settings.MaleName || ''} onChange={e=>upd({ MaleName: e.target.value })} />
        <div>{t('SettingsPageFemaleNameText')}</div>
        <input className="w-full" value={settings.FemaleName || ''} onChange={e=>upd({ FemaleName: e.target.value })} />
        <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={!!settings.RandomNames} onChange={e=>upd({ RandomNames: e.target.checked })}/> {t('SettingsPageRandomNamesChk')}</label>
        <div>{t('SettingsPageAffixText')}</div>
        <input className="w-full" value={settings.Affix || ''} onChange={e=>upd({ Affix: e.target.value })} />
        <div>{t('SettingsPageFarmText')}</div>
        <input className="w-full" value={settings.Farm || ''} onChange={e=>upd({ Farm: e.target.value })} />
      </section>

      <section className="bg-card p-3 rounded-xl space-y-2 col-span-3">
        <div className="font-semibold">{t('SettingsPageCenterText')}</div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-center">{t('SettingsPageAllText')}</div>
            <select className="w-full" value={settings.CentreDuration || '3'} onChange={e=>upd({ CentreDuration: e.target.value })}>
              {[1,3,10,30,60].map(v=> <option key={v}>{v}</option>)}
            </select>
            <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={!!settings.CentreHay} onChange={e=>upd({ CentreHay: e.target.checked })}/> {t('SettingsPageWithHayChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.CentreOat} onChange={e=>upd({ CentreOat: e.target.checked })}/> {t('SettingsPageWithOatChk')}</label>
            <hr className="my-2" />
            <div className="font-semibold">{t('SettingsPageReserveText')}</div>
            <div className="flex items-center gap-2"><span>ID:</span> <input className="w-40" value={settings.ReserveID || ''} onChange={e=>upd({ ReserveID: e.target.value })} /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.SelfReserve} onChange={e=>upd({ SelfReserve: e.target.checked })}/> {t('SettingsPageSelfChk')}</label>
            <select className="w-full" value={settings.ReserveDuration || ''} onChange={e=>upd({ ReserveDuration: e.target.value })}>
              {[1,3,10,30,60].map(v=> <option key={v}>{v}</option>)}
            </select>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.WriteToAll} onChange={e=>upd({ WriteToAll: e.target.checked })}/> {t('SettingsPageContinueToAllChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.Continue} onChange={e=>upd({ Continue: e.target.checked })}/> {t('SettingsPageContinueChk')}</label>
            <select className="w-full" value={settings.ContinueDuration || ''} onChange={e=>upd({ ContinueDuration: e.target.value })}>
              {[3,10,30,60,100].map(v=> <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <div className="font-semibold">{t('SettingsPageBuySellText')}</div>
            <div>{t('SettingsPageHayQuanText')}</div>
            <select className="w-full" value={settings.BuyHay || ''} onChange={e=>upd({ BuyHay: e.target.value })}>
              {['',500,600,700,800,900,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000].map(v=> <option key={v}>{v}</option>)}
            </select>
            <div>{t('SettingsPageOatQuanText')}</div>
            <select className="w-full" value={settings.BuyOat || ''} onChange={e=>upd({ BuyOat: e.target.value })}>
              {['',500,600,700,800,900,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000].map(v=> <option key={v}>{v}</option>)}
            </select>
            <hr className="my-2" />
            <div>{t('SettingsPageSellMainText')}</div>
            <select className="w-full" value={settings.MainProductToSell ?? 3} onChange={e=>upd({ MainProductToSell: Number(e.target.value) })}>
              {productOptions.map(o => <option key={o.value} value={o.value}>{t(o.key)}</option>)}
            </select>
            <div>{t('SettingsPageSellSubText')}</div>
            <select className="w-full" value={settings.SubProductToSell ?? 0} onChange={e=>upd({ SubProductToSell: Number(e.target.value) })}>
              {[{ value: 0, key: 'None' }, ...productOptions].map(o => <option key={o.value} value={o.value}>{t(o.key)}</option>)}
            </select>
            <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={!!settings.Sharing} onChange={e=>upd({ Sharing: e.target.checked })}/> {t('SettingsPageTurnOnCoChk')}</label>
          </div>
          <div>
            <div className="font-semibold">{t('SettingsPageGoText')}</div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.Mission} onChange={e=>upd({ Mission: e.target.checked })}/> {t('SettingsPageMissionChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.OldHorses} onChange={e=>upd({ OldHorses: e.target.checked })}/> {t('SettingsPageOldHorseChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.SellShit} onChange={e=>upd({ SellShit: e.target.checked })}/> {t('SettingsPageSellShitChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.LoadSleep} onChange={e=>upd({ LoadSleep: e.target.checked })}/> {t('SettingsPageLoadSleepChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.GoBabies} onChange={e=>upd({ GoBabies: e.target.checked })}/> {t('SettingsPageBabiesChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.Stroke} onChange={e=>upd({ Stroke: e.target.checked })}/> {t('SettingsPageStrokeChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.MissionOld} onChange={e=>upd({ MissionOld: e.target.checked })}/> {t('SettingsPageMissionOldChk')}</label>
            <div className="mt-2">{t('SettingsPageHPLimitText')}</div>
            <input className="w-full" value={settings.HealthEdge || ''} onChange={e=>upd({ HealthEdge: e.target.value })} />
            <div className="mt-2">{t('SettingsPageStartWithText')}</div>
            <input className="w-full" value={settings.SkipIndex || 0} onChange={e=>upd({ SkipIndex: Number(e.target.value||0) })} />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={async ()=> { await window.api.settings.apply(settings, scope); window.location.assign('/') }}>{t('SettingsPageAcceptBtn')}</button>
          <button onClick={async ()=> { await window.api.settings.saveToFile(settings) }}>{t('SettingsPageSaveBtn')}</button>
          <button onClick={async ()=> { const gs = await window.api.settings.loadFromFile(); const s = (gs?.Settings)||{}; setSettings(s) }}>{t('SettingsPageLoadBtn')}</button>
          <button onClick={()=> setSettings(defaultSettings())}>{t('SettingsPageRefreshBtn')}</button>
          <button onClick={()=> window.location.assign('/')}>{t('SettingsPageReturnBtn')}</button>
        </div>
      </section>
    </div>
  )
}