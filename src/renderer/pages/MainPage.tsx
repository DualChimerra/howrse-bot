import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { VERSION } from '@common/version'

export default function MainPage() {
  const { t } = useTranslation()
  const [accounts, setAccounts] = useState<any[]>([])
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const [globals, setGlobals] = useState<any>({ Sort: 'age', WorkType: 0, ClientType: 0, ParallelHorse: false, RandomPause: false, Tray: true, MoneyNotification: false, Settings: {} })
  const [status, setStatus] = useState('')
  const [version, setVersion] = useState('')
  const [farms, setFarms] = useState<{ Name: string; Id: string }[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { const onToggle = () => setMenuOpen(v => !v); window.addEventListener('toggle-menu', onToggle); return () => window.removeEventListener('toggle-menu', onToggle) }, [])
  const selected = selectedIdx >= 0 ? accounts[selectedIdx] : null

  useEffect(() => {
    const init = async () => {
      const s = await window.api.state.init()
      setAccounts(s.accounts || [])
      setSelectedIdx(s.selected ?? -1)
      setGlobals(s.globalSettings || globals)
      setVersion(VERSION)
      if ((s.selected ?? -1) >= 0) {
        const list = await window.api.farms.load(s.selected)
        setFarms(list)
      }
    }
    init()
    window.api.events.onStatusUpdate((p) => {
      if (typeof p.runningCount !== 'undefined' || typeof p.doneCount !== 'undefined') setStatus(`${p.runningCount ?? ''} / ${p.doneCount ?? ''}`)
    })
    window.api.events.onNotify((_p) => {})
  }, [])

  const refreshState = async () => {
    const s = await window.api.state.get(); setAccounts(s.accounts||[]); setGlobals(s.globalSettings||globals)
  }

  const onChangeGlobal = (patch: Partial<typeof globals>) => {
    const next = { ...globals, ...patch }
    setGlobals(next)
    window.api.globals.update(next)
  }

  const onSelect = async (i: number) => {
    setSelectedIdx(i); await window.api.state.selectAccount(i); const list = await window.api.farms.load(i); setFarms(list)
  }

  const accountItems = useMemo(() => accounts.map((a, i) => (
    <div key={`${a.Login}-${i}`} className={`px-2 py-1 rounded-md cursor-pointer ${i===selectedIdx?'bg-accent/20':''}`} onClick={() => { onSelect(i) }}>
      <span className="mr-2">{a.Login}</span>
      <span className="text-wheat">{a.Type === 1 ? t('AccTypeString') : ''}</span>
    </div>
  )), [accounts, selectedIdx])

  const onAddFarm = async (id?: string) => {
    if (selectedIdx < 0) return
    const farmId = id ?? ''
    await window.api.farms.addToQueue(selectedIdx, farmId)
    await refreshState()
  }
  const onRemoveFarm = async (id?: string) => { if (selectedIdx < 0 || !id) return; await window.api.farms.removeFromQueue(selectedIdx, id); await refreshState() }
  const onClearFarms = async () => { if (selectedIdx < 0) return; await window.api.farms.clearQueue(selectedIdx); await refreshState() }
  const onReloadFarms = async () => { if (selectedIdx < 0) return; const list = await window.api.farms.load(selectedIdx); setFarms(list) }

  const loginCoLabel = selected?.Type === 1 ? t('LogoffCoConverter') : t('LoginCoConverter')
  const onLoginCo = async () => {
    if (selectedIdx < 0) return
    if (selected?.Type === 1) { await window.api.login.logoutCo(selectedIdx); await refreshState() }
    else { window.location.assign('/login-co') }
  }

  const productName = (n?: number) => {
    const keys = ['None','Hay','Oat','Wheat','Shit','Leather','Apples','Carrot','Wood','Steel','Sand','Straw','Flax','OR']
    if (typeof n !== 'number') return 'Wheat'
    return keys[n] || 'Wheat'
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full">
      <div className="grid grid-cols-4 gap-4">
        <aside className={`bg-card p-3 rounded-xl w-64 transition-all ${menuOpen ? 'opacity-100' : 'opacity-80'}`}>
          <div className="space-y-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!globals.RandomPause} onChange={e=>onChangeGlobal({ RandomPause: e.target.checked })}/> {t('MainMenuRandomPausesChk')}</label>
            <hr />
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!globals.ParallelHorse} onChange={e=>onChangeGlobal({ ParallelHorse: e.target.checked })}/> {t('MainMenuParallelHorsesChk')}</label>
            <hr />
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!globals.Tray} onChange={e=>onChangeGlobal({ Tray: e.target.checked })}/> {t('MainMenuTrayChk')}</label>
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
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!globals.MoneyNotification} onChange={e=>onChangeGlobal({ MoneyNotification: e.target.checked })}/> {t('MainMenuNotificationsChk')}</label>
          </div>
        </aside>

        <div className="flex flex-col items-stretch gap-2">
          <div className="text-sm">{t('AccountNum')}: {accounts.length}</div>
          <div className="flex-1 bg-card rounded-xl p-2 overflow-auto">{accountItems}</div>
        </div>

        <div className="flex flex-col gap-2 justify-center">
          <button onClick={()=>{ window.location.assign('/login') }}>{t('MainPageAddAccBtn')}</button>
          <button onClick={()=>{ window.api.accounts.removeSelected().then(async ()=>{ const s = await window.api.state.get(); setAccounts(s.accounts) }) }}>{t('MainPageDeleteAccBtn')}</button>
          <button onClick={onLoginCo}>{loginCoLabel}</button>
          <button onClick={()=>{ window.api.accounts.saveCoSelected() }}>{t('MainPageSaveCoBtn')}</button>
          <button onClick={()=> window.location.assign('/settings')}>{t('MainPageSettingsBtn')}</button>
          <button onClick={()=> window.location.assign('/management')}>{t('MainPageAccManagmentBtn')}</button>
          <button onClick={()=> window.api.accounts.saveToFile()}>{t('MainPageSaveAccListBtn')}</button>
          <button onClick={async ()=>{ const accs = await window.api.accounts.loadFromFile(); setAccounts(accs) }}>{t('MainPageLoadAccListBtn')}</button>
          <button onClick={()=> window.location.assign('/status')}>{t('MainPageOpenStatusBtn')}</button>
        </div>

        <div className="grid grid-rows-[auto_1fr] gap-2">
          <div className="bg-card rounded-xl p-2 text-sm space-y-1">
            <div>{t('MainPageNameText')}: {selected?.Login ?? ''}</div>
            <div>{t('MainPagePassText')}: {selected?.Pass ?? ''}</div>
            <div>{t('MainPageORText')}: {selected?.OR?.Amount ?? ''}</div>
            <div>{t('MainPageEquText')}: {selected?.Equ ?? ''}</div>
            <div>{t('MainPageHayText')}: {selected?.Hay?.Amount ?? ''}</div>
            <div>{t('MainPageOatText')}: {selected?.Oat?.Amount ?? ''}</div>
            <div>{t('MainPageShitText')}: {selected?.Shit?.Amount ?? ''}</div>
            <div>{t(productName(selected?.MainProductToSell?.Type))}: {selected?.MainProductToSell?.Amount ?? ''}</div>
            <div>{t(productName(selected?.SubProductToSell?.Type))}: {selected?.SubProductToSell?.Amount ?? ''}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card rounded-xl p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold">{t('MainPageFarmsList')}</div>
                <button className="text-xs" onClick={onReloadFarms}>{t('MainPageReloadFarmsBtn')}</button>
              </div>
              <div className="h-48 overflow-auto">
                {farms.map(f => (
                  <div key={f.Id + f.Name} className="px-2 py-1 cursor-pointer hover:bg-accent/10" onClick={()=>onAddFarm(f.Id)}>
                    {f.Name}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right">
                <button className="text-xs" onClick={()=>onAddFarm('')}>{t('MainPageAddAllFarmsBtn')}</button>
              </div>
            </div>
            <div className="bg-card rounded-xl p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold">{t('MainPageQueueList')}</div>
                <div className="flex gap-2">
                  <button className="text-xs" onClick={onClearFarms}>{t('MainPageClearQueueBtn')}</button>
                </div>
              </div>
              <div className="h-48 overflow-auto">
                {(selected?.FarmsQueue||[]).map((id: string) => {
                  const name = farms.find(f=>f.Id===id)?.Name || (id ? id : t('MainPageAllFarms'))
                  return (
                    <div key={id} className="px-2 py-1 flex items-center justify-between">
                      <span>{name}</span>
                      <button className="text-xs" onClick={()=>onRemoveFarm(id)}>{t('MainPageRemoveBtn')}</button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3">
        <button onClick={()=> selectedIdx>=0 && window.api.work.startSingle(selectedIdx)}>{t('MainPageStartBtn')}</button>
        <button onClick={()=> window.api.work.startAll()}>{t('MainPageStartAllBtn')}</button>
        <button onClick={()=> selectedIdx>=0 && window.api.work.stopSingle(selectedIdx)}>{t('MainPageStopBtn')}</button>
        <button onClick={()=> window.api.work.stopAll()}>{t('MainPageStopAllBtn')}</button>
      </div>

      <div className="bg-[#202225] border-t border-black mt-2">
        <div className="grid grid-cols-[auto_1fr_auto] text-[10px] text-white py-1 px-2">
          <div>{t('MainMenuModeText')}: {/* enum to description handled by i18n keys */}</div>
          <div className="text-center">{status}</div>
          <div>{t('MainPageVersionText')} {version}</div>
        </div>
      </div>
    </div>
  )
}