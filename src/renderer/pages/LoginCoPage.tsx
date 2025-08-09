import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LoginCoPage() {
  const { t } = useTranslation()
  const [coList, setCoList] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('')
  const [idx, setIdx] = useState(0)

  useEffect(() => { (async ()=>{ const s = await window.api.state.get(); setIdx(s.selected||0); const list = await window.api.login.listCo(s.selected||0); setCoList(list||[]) })() }, [])

  const onLogin = async () => {
    if (!selected) return
    await window.api.login.co(idx, selected, true)
    window.location.assign('/')
  }

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="h-52 bg-bg rounded-xl mb-4 overflow-auto">
        {coList.map((u) => (
          <div key={u} className={`px-2 py-1 cursor-pointer ${selected===u?'bg-accent/20':''}`} onClick={()=>setSelected(u)}>{u}</div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <button className="w-24 h-10" onClick={onLogin} disabled={!selected}>{t('LoginCoPageLoginBtn')}</button>
        <button className="w-24 h-10" onClick={()=>window.location.assign('/')}>{t('LoginCoPageCancelBtn')}</button>
      </div>
    </div>
  )
}