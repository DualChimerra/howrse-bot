import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function MainPage() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-3 gap-4">
      <aside className="bg-card p-3 rounded-xl w-64">
        <div className="space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" /> {t('MainMenuRandomPausesChk')}</label>
          <hr />
          <label className="flex items-center gap-2"><input type="checkbox" /> {t('MainMenuParallelHorsesChk')}</label>
          <hr />
          <label className="flex items-center gap-2"><input type="checkbox" /> {t('MainMenuTrayChk')}</label>
          <hr />
          <div className="text-center">{t('MainMenuSortText')}</div>
          <select className="w-full">
            <option value="age">{t('SortAge')}</option>
            <option value="race">{t('SortRace')}</option>
            <option value="nom">{t('SortName')}</option>
            <option value="naissance">{t('SortDate')}</option>
            <option value="competence">{t('SortSkills')}</option>
            <option value="potentiel-genetique">{t('SortPG')}</option>
          </select>
          <div className="text-center">{t('MainMenuModeText')}</div>
          <select className="w-full">
            <option value="SingleOrder">{t('ModeSingleOrder')}</option>
            <option value="GlobalOrder">{t('ModeGlobalOrder')}</option>
            <option value="SingleParallel">{t('ModeSingleParallel')}</option>
            <option value="GlobalParallel">{t('ModeGlobalParallel')}</option>
          </select>
          <div className="text-center">{t('MainMenuInternetText')}</div>
          <select className="w-full">
            <option value="New">{t('ClientNew')}</option>
            <option value="Old">{t('ClientOld')}</option>
          </select>
          <label className="flex items-center gap-2"><input type="checkbox" /> {t('MainMenuNotificationsChk')}</label>
        </div>
      </aside>

      <div className="flex flex-col items-stretch gap-2">
        <div className="text-sm">{t('AccountNum')}: 0</div>
        <div className="flex-1 bg-card rounded-xl p-2 overflow-auto">
          {/* Accounts list will be rendered here via renderer state (no network) */}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button>{t('MainPageAddAccBtn')}</button>
        <button>{t('MainPageDeleteAccBtn')}</button>
        <button>{t('LoginCoConverter')}</button>
        <button>{t('MainPageSaveCoBtn')}</button>
        <Link to="/settings"><button>{t('MainPageSettingsBtn')}</button></Link>
        <Link to="/management"><button>{t('MainPageAccManagmentBtn')}</button></Link>
        <button>{t('MainPageSaveAccListBtn')}</button>
        <button>{t('MainPageLoadAccListBtn')}</button>
        <Link to="/status"><button className="mt-2">{t('MainPageOpenStatusBtn')}</button></Link>
      </div>
    </div>
  )
}