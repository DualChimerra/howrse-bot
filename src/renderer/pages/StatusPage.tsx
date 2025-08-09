import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function StatusPage() {
  const { t } = useTranslation()
  const [accounts, setAccounts] = useState<any[]>([])
  const [selected, setSelected] = useState(0)
  const [notifications, setNotifications] = useState<string[]>([])
  const [runningCount, setRunningCount] = useState(0)
  const [doneCount, setDoneCount] = useState(0)

  useEffect(() => {
    (async () => { const s = await window.api.state.get(); setAccounts(s.accounts||[]); setSelected(s.selected||0) })()
    window.api.events.onNotify((p) => {
      if (p?.key) setNotifications(n => [...n, t(p.key)])
      else if (p?.text) setNotifications(n => [...n, p.text])
    })
    window.api.events.onStatusUpdate((p) => {
      if (typeof p.runningCount !== 'undefined') setRunningCount(p.runningCount)
      if (typeof p.doneCount !== 'undefined') setDoneCount(p.doneCount)
      if (typeof p.accountIndex === 'number' && p.kind && typeof p.value === 'string') {
        setAccounts(prev => {
          const next = prev.slice()
          const acc = { ...(next[p.accountIndex] || {}) }
          if (p.kind === 'farm') acc.ProgressFarm = p.value
          else if (p.kind === 'horse') acc.ProgressHorse = p.value
          else if (p.kind === 'status') acc.Progress = p.value
          next[p.accountIndex] = acc
          return next
        })
      }
    })
  }, [])

  const acc = accounts[selected]

  return (
    <div className="grid grid-rows-[1fr_auto] h-full">
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
          <button onClick={()=> window.api.work.startAll()} >{t('MainPageStartAllBtn')}</button>
          <button onClick={()=> window.api.work.stopSingle(selected)}>{t('MainPageStopBtn')}</button>
          <button onClick={()=>window.api.work.stopAll()}>{t('MainPageStopAllBtn')}</button>
          <button onClick={()=>window.location.assign('/status')}>{t('MainPageOpenStatusBtn')}</button>
        </div>
        <div className="bg-card rounded-xl p-3 col-span-2">
          <div className="text-center mb-2">{t('StatusPageNotificationsText')}</div>
          <div className="bg-bg rounded-xl h-48 overflow-auto p-2 text-sm">
            {notifications.map((n,i)=>(<div key={i}>{n}</div>))}
          </div>
        </div>
      </div>
      <div className="bg-[#202225] border-t border-black mt-2">
        <div className="grid grid-cols-[auto_1fr_auto] text-[10px] text-white py-1 px-2">
          <div>{t('MainMenuModeText')}</div>
          <div className="text-center">{runningCount} / {doneCount}</div>
          <div>{t('MainPageVersionText')}</div>
        </div>
      </div>
    </div>
  )
}