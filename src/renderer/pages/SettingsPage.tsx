import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<any>({})

  useEffect(() => { (async () => { const s = await window.api.state.get(); setSettings((s.globalSettings||{}).Settings || {}) })() }, [])

  const upd = (patch: any) => setSettings((s: any) => ({ ...s, ...patch }))

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
          </div>
          <div>
            <div className="font-semibold">{t('SettingsPageReserveText')}</div>
            <div className="flex items-center gap-2"><span>ID:</span> <input className="w-40" value={settings.ReserveID || ''} onChange={e=>upd({ ReserveID: e.target.value })} /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.SelfReserve} onChange={e=>upd({ SelfReserve: e.target.checked })}/> {t('SettingsPageSelfChk')}</label>
            <select className="w-full" value={settings.ReserveDuration || ''} onChange={e=>upd({ ReserveDuration: e.target.value })}>
              {[1,3,10,30,60].map(v=> <option key={v}>{v}</option>)}
            </select>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.WriteToAll} onChange={e=>upd({ WriteToAll: e.target.checked })}/> {t('SettingsPageWriteToAll')}</label>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={()=> window.api.settings.apply(settings, 'global')}>{t('SettingsPageSaveBtn')}</button>
          <button onClick={()=> window.location.assign('/')}>{t('SettingsPageReturnBtn')}</button>
        </div>
      </section>
    </div>
  )
}