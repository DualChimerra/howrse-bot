import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LoginCoPage() {
  const { t } = useTranslation()
  const [co, setCo] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => { (async ()=>{ const s = await window.api.state.get(); setIdx(s.selected||0) })() }, [])

  const onLogin = async () => {
    await window.api.login.co(idx, co, true)
    window.location.assign('/')
  }

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="h-52 bg-bg rounded-xl mb-4 flex items-center justify-center">
        <input className="w-64" placeholder="loginCo" value={co} onChange={e=>setCo(e.target.value)} />
      </div>
      <div className="flex items-center justify-center gap-4">
        <button className="w-24 h-10" onClick={onLogin}>{t('LoginCoPageLoginBtn')}</button>
        <button className="w-24 h-10" onClick={()=>window.location.assign('/')}>{t('LoginCoPageCancelBtn')}</button>
      </div>
    </div>
  )
}