import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function StatusPage() {
  const { t } = useTranslation()
  const [accounts, setAccounts] = useState<any[]>([])
  const [selected, setSelected] = useState(0)
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    (async () => { const s = await window.api.state.get(); setAccounts(s.accounts||[]); setSelected(s.selected||0) })()
    window.api.events.onNotify((p) => setNotifications(n => [...n, p.text]))
  }, [])

  const acc = accounts[selected]

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div>{t('AccountNum')}: {accounts.length}</div>
        <div className="bg-card rounded-xl h-64 mt-2 overflow-auto">
          {accounts.map((a, i) => (
            <div key={i} className={`px-2 py-1 cursor-pointer ${i===selected?'bg-accent/20':''}`} onClick={()=>setSelected(i)}>
              {a.Login} <span className="text-wheat">{a.Progress || ''}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-xl p-3">
        <div>{t('StatusPageAccountText')}: {acc?.Login || ''}</div>
        <div>{t('StatusPageFarmText')}: {acc?.ProgressFarm || ''}</div>
        <div>{t('StatusPageProgressText')}: {acc?.Progress || ''}</div>
        <div>{t('StatusPageORText')}: {acc?.OR?.Amount ?? ''}</div>
        <div>{t('StatusPageEquText')}: {acc?.Equ ?? ''}</div>
        <div>{t('StatusPageHayText')}: {acc?.Hay?.Amount ?? ''}</div>
        <div>{t('StatusPageOatText')}: {acc?.Oat?.Amount ?? ''}</div>
        <div>{t('StatusPageShitText')}: {acc?.Shit?.Amount ?? ''}</div>
      </div>
      <div className="col-span-2 grid grid-cols-5 gap-2">
        <button onClick={()=>window.api.work.startSingle(selected)}>{t('MainPageStartBtn')}</button>
        <button onClick={()=>{ /* iterate all via renderer loop calling startSingle sequentially */ }} >{t('MainPageStartAllBtn')}</button>
        <button onClick={()=>{ /* would need per-account abort handle; not implemented here */ }}>{t('MainPageStopBtn')}</button>
        <button onClick={()=>window.api.work.stopAll()}>{t('MainPageStopAllBtn')}</button>
        <button>{t('MainPageOpenStatusBtn')}</button>
      </div>
      <div className="bg-card rounded-xl p-3 col-span-2">
        <div className="text-center mb-2">{t('StatusPageNotificationsText')}</div>
        <div className="bg-bg rounded-xl h-48 overflow-auto p-2 text-sm">
          {notifications.map((n,i)=>(<div key={i}>{n}</div>))}
        </div>
      </div>
    </div>
  )
}