import React from 'react'
import { useTranslation } from 'react-i18next'

export default function StatusPage() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div>{t('AccountNum')}: 0</div>
        <div className="bg-card rounded-xl h-64 mt-2" />
      </div>
      <div className="bg-card rounded-xl p-3">
        <div>{t('StatusPageAccountText')}: </div>
        <div>{t('StatusPageFarmText')}: </div>
        <div>{t('StatusPageProgressText')}: </div>
        <div>{t('StatusPageORText')}: </div>
        <div>{t('StatusPageEquText')}: </div>
        <div>{t('StatusPageHayText')}: </div>
        <div>{t('StatusPageOatText')}: </div>
        <div>{t('StatusPageShitText')}: </div>
      </div>
      <div className="col-span-2 grid grid-cols-5 gap-2">
        <button>{t('MainPageStartBtn')}</button>
        <button>{t('MainPageStartAllBtn')}</button>
        <button>{t('MainPageStopBtn')}</button>
        <button>{t('MainPageStopAllBtn')}</button>
        <button>{t('MainPageOpenStatusBtn')}</button>
      </div>
      <div className="bg-card rounded-xl p-3 col-span-2">
        <div className="text-center mb-2">{t('StatusPageNotificationsText')}</div>
        <div className="bg-bg rounded-xl h-48" />
      </div>
    </div>
  )
}