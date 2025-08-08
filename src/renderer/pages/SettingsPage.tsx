import React from 'react'
import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-3 gap-4">
      <section className="bg-card p-3 rounded-xl">
        <div className="font-semibold mb-2">{t('SettingsPageHorsingFemaleText')}</div>
        <div className="space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageTurnOnFemaleChk')}</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageCleanBloodChk')}</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageSelfMaleChk')}</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageBuyWheatChk')}</label>
          <div className="text-center">{t('SettingsPageBuyBelowText')}</div>
          <select className="w-full">
            {[500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6500,7000,7500].map(v=> <option key={v}>{v}</option>)}
          </select>
          <div className="text-center mt-2">{t('SettingsPageFarmerText')}</div>
          <input className="w-full" />
        </div>
      </section>

      <section className="bg-card p-3 rounded-xl space-y-2">
        <div className="font-semibold">{t('SettingsPageHorsingFemaleText2')}</div>
        <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageTeamChk')}</label>
        <div className="flex items-center gap-2">
          <div>{t('SettingsPageGPBelowText')}</div>
          <input className="w-24" />
        </div>
        <div className="font-semibold mt-2">{t('SettingsPageHorsingMaleText')}</div>
        <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageTurnOnMaleChk')}</label>
        <div>{t('SettingsPagePriceText')}</div>
        <select className="w-full">
          {[500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6500,7000,7500].map(v=> <option key={v}>{v}</option>)}
        </select>
        <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageCarrotChk')}</label>
        <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageToTeamChk')}</label>
      </section>

      <section className="bg-card p-3 rounded-xl space-y-2">
        <div className="font-semibold">{t('SettingsPageBabiesText')}</div>
        <div>{t('SettingsPageMaleNameText')}</div>
        <input className="w-full" />
        <div>{t('SettingsPageFemaleNameText')}</div>
        <input className="w-full" />
        <label className="flex items-center gap-2 mt-2"><input type="checkbox" /> {t('SettingsPageRandomNamesChk')}</label>
        <div>{t('SettingsPageAffixText')}</div>
        <input className="w-full" />
        <div>{t('SettingsPageFarmText')}</div>
        <input className="w-full" />
      </section>

      <section className="bg-card p-3 rounded-xl space-y-2 col-span-3">
        <div className="font-semibold">{t('SettingsPageCenterText')}</div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-center">{t('SettingsPageAllText')}</div>
            <select className="w-full">
              {[1,3,10,30,60].map(v=> <option key={v}>{v}</option>)}
            </select>
            <label className="flex items-center gap-2 mt-2"><input type="checkbox" /> {t('SettingsPageWithHayChk')}</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageWithOatChk')}</label>
          </div>
          <div>
            <div className="font-semibold">{t('SettingsPageReserveText')}</div>
            <div className="flex items-center gap-2"><span>ID:</span> <input className="w-40" /></div>
            <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageSelfChk')}</label>
            <select className="w-full">
              {[1,3,10,30,60].map(v=> <option key={v}>{v}</option>)}
            </select>
            <label className="flex items-center gap-2"><input type="checkbox" /> {t('SettingsPageWriteToAll')}</label>
          </div>
        </div>
      </section>
    </div>
  )
}