import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function MainPage() {
  const { t } = useTranslation()
  const [accounts, setAccounts] = useState<any[]>([])
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const [globals, setGlobals] = useState<any>({ Sort: 'age', WorkType: 0, ClientType: 0, ParallelHorse: false, RandomPause: false, Tray: true, MoneyNotification: false })
  const [status, setStatus] = useState('')
  const [version, setVersion] = useState('')

  useEffect(() => {
    const init = async () => {
      const s = await window.api.state.init()
      setAccounts(s.accounts || [])
      setSelectedIdx(s.selected ?? -1)
      setGlobals(s.globalSettings || globals)
    }
    init()
    const unsub1 = window.api.events.onStatusUpdate((p) => {
      setStatus((prev) => prev)
    })
    const unsub2 = window.api.events.onNotify((_p) => {})
    return () => {
      // @ts-expect-error removeListener signature
      window.api.events.onStatusUpdate(() => {})
      // @ts-expect-error removeListener signature
      window.api.events.onNotify(() => {})
    }
  }, [])

  const onChangeGlobal = (patch: Partial<typeof globals>) => {
    const next = { ...globals, ...patch }
    setGlobals(next)
    // persist immediately as global scope
    window.api.settings.apply({ ...next.Settings, ...next.Settings }, 'global')
  }

  const accountItems = useMemo(() => accounts.map((a, i) => (
    <div key={`${a.Login}-${i}`} className={`px-2 py-1 rounded-md cursor-pointer ${i===selectedIdx?'bg-accent/20':''}`} onClick={() => { setSelectedIdx(i); window.api.state.selectAccount(i) }}>
      <span className="mr-2">{a.Login}</span>
      <span className="text-wheat">{a.Type === 1 ? t('AccTypeString') : ''}</span>
    </div>
  )), [accounts, selectedIdx])

  return (
    <div className="grid grid-cols-3 gap-4">
      <aside className="bg-card p-3 rounded-xl w-64">
        <div className="space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={globals.RandomPause} onChange={e=>onChangeGlobal({ RandomPause: e.target.checked })}/> {t('MainMenuRandomPausesChk')}</label>
          <hr />
          <label className="flex items-center gap-2"><input type="checkbox" checked={globals.ParallelHorse} onChange={e=>onChangeGlobal({ ParallelHorse: e.target.checked })}/> {t('MainMenuParallelHorsesChk')}</label>
          <hr />
          <label className="flex items-center gap-2"><input type="checkbox" checked={globals.Tray} onChange={e=>onChangeGlobal({ Tray: e.target.checked })}/> {t('MainMenuTrayChk')}</label>
          <hr />
          <div className="text-center">{t('MainMenuSortText')}</div>
          <select className="w-full" value={globals.Sort} onChange={e=>onChangeGlobal({ Sort: e.target.value })}>
            <option value="age">{t('SortAge')}</option>
            <option value="race">{t('SortRace')}</option>
            <option value="nom">{t('SortName')}</option>
            <option value="naissance">{t('SortDate')}</option>
            <option value="competence">{t('SortSkills')}</option>
            <option value="potentiel-genetique">{t('SortPG')}</option>
          </select>
          <div className="text-center">{t('MainMenuModeText')}</div>
          <select className="w-full" value={globals.WorkType} onChange={e=>onChangeGlobal({ WorkType: Number(e.target.value) })}>
            <option value={0}>{t('ModeSingleOrder')}</option>
            <option value={1}>{t('ModeGlobalOrder')}</option>
            <option value={2}>{t('ModeSingleParallel')}</option>
            <option value={3}>{t('ModeGlobalParallel')}</option>
          </select>
          <div className="text-center">{t('MainMenuInternetText')}</div>
          <select className="w-full" value={globals.ClientType} onChange={e=>onChangeGlobal({ ClientType: Number(e.target.value) })}>
            <option value={0}>{t('ClientNew')}</option>
            <option value={1}>{t('ClientOld')}</option>
          </select>
          <label className="flex items-center gap-2"><input type="checkbox" checked={globals.MoneyNotification} onChange={e=>onChangeGlobal({ MoneyNotification: e.target.checked })}/> {t('MainMenuNotificationsChk')}</label>
        </div>
      </aside>

      <div className="flex flex-col items-stretch gap-2">
        <div className="text-sm">{t('AccountNum')}: {accounts.length}</div>
        <div className="flex-1 bg-card rounded-xl p-2 overflow-auto">
          {accountItems}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={()=>{ window.location.assign('/login') }}>{t('MainPageAddAccBtn')}</button>
        <button onClick={()=>{ window.api.accounts.removeSelected().then(async ()=>{ const s = await window.api.state.get(); setAccounts(s.accounts) }) }}>{t('MainPageDeleteAccBtn')}</button>
        <button onClick={()=>{ /* toggled via acc type in settings */ }}>{t('LoginCoConverter')}</button>
        <button onClick={()=>{ /* Save Co Account handled server-side if needed */ }}>{t('MainPageSaveCoBtn')}</button>
        <Link to="/settings"><button>{t('MainPageSettingsBtn')}</button></Link>
        <Link to="/management"><button>{t('MainPageAccManagmentBtn')}</button></Link>
        <button onClick={()=> window.api.accounts.saveAll()}>{t('MainPageSaveAccListBtn')}</button>
        <button onClick={async ()=>{ const accs = await window.api.accounts.loadAll(); setAccounts(accs) }}>{t('MainPageLoadAccListBtn')}</button>
        <Link to="/status"><button className="mt-2">{t('MainPageOpenStatusBtn')}</button></Link>
      </div>
    </div>
  )
}