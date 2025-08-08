import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const serverOptions = ['Australia','England','Arabic','Bulgaria','International','Spain','Canada','Germany','Norway','Poland','Russia','Romain','USA','FranceOuranos','FranceGaia','Sweden'] as const

export default function LoginPage() {
  const { t } = useTranslation()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [proxyIP, setProxyIP] = useState('')
  const [proxyLogin, setProxyLogin] = useState('')
  const [proxyPassword, setProxyPassword] = useState('')
  const [server, setServer] = useState('Russia')
  const [saved, setSaved] = useState<any[]>([])
  const [selected, setSelected] = useState<number>(-1)
  const [busy, setBusy] = useState(false)

  useEffect(() => { (async () => { const accs = await window.api.storage.loadAccounts(); setSaved(accs as any[] || []) })() }, [])

  const onLogin = async () => {
    if (busy) return
    setBusy(true)
    try {
      const acc = {
        Login: login,
        Password: password,
        Server: serverOptions.indexOf(server as any),
        Type: 0,
        PrivateSettings: {},
        ProxyIP: proxyIP,
        ProxyLogin: proxyLogin,
        ProxyPassword: proxyPassword,
        FarmsQueue: [],
        Settings: {}
      }
      await window.api.accounts.add(acc)
      const state = await window.api.state.get()
      // select last
      await window.api.state.selectAccount(state.accounts.length - 1)
      // perform login now (load=true)
      await window.api.login.normal(state.accounts.length - 1, true)
      if (remember) {
        await window.api.storage.saveAccounts(state.accounts)
      }
      // back to main
      window.location.assign('/')
    } finally { setBusy(false) }
  }

  const onDelete = async () => {
    if (selected < 0) return
    const arr = saved.slice()
    arr.splice(selected, 1)
    setSaved(arr)
    await window.api.storage.saveAccounts(arr)
  }

  const onClear = async () => {
    setSaved([])
    await window.api.storage.saveAccounts([])
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="text-lg font-semibold">{t('LoginPageLoginText')}</div>
        <input value={login} onChange={e=>setLogin(e.target.value)} />
        <div className="text-lg font-semibold">{t('LoginPagePasswordText')}</div>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> {t('LoginPageSavedAccountsText')}</label>
        <hr />
        <div className="text-lg font-semibold">{t('LoginPageProxyText')}</div>
        <div className="text-sm">IP</div>
        <input value={proxyIP} onChange={e=>setProxyIP(e.target.value)} />
        <div className="text-sm">{t('LoginPageProxyLoginText')}</div>
        <input value={proxyLogin} onChange={e=>setProxyLogin(e.target.value)} />
        <div className="text-sm">{t('LoginPageProxyPasswordText')}</div>
        <input value={proxyPassword} onChange={e=>setProxyPassword(e.target.value)} />
        <hr />
        <div className="text-lg font-semibold">{t('LoginPageServerText')}</div>
        <select value={server} onChange={e=>setServer(e.target.value)}>
          {serverOptions.map(s => (
            <option key={s} value={s}>{t('Server' + s)}</option>
          ))}
        </select>
        <button className="mt-4 h-12 text-lg" onClick={onLogin} disabled={busy}>{t('LoginPageLoginBtn')}</button>
      </div>
      <div>
        <div className="text-lg font-semibold mb-2">{t('LoginPageSavedAccountsText')}</div>
        <div className="bg-card rounded-xl h-80 overflow-auto">
          {saved.map((a, i) => (
            <div key={i} className={`px-2 py-1 cursor-pointer ${selected===i?'bg-accent/20':''}`} onClick={()=>setSelected(i)}>
              {a.Login}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button onClick={onDelete}>{t('LoginPageDeleteBtn')}</button>
          <button onClick={onClear}>{t('LoginPageClearBtn')}</button>
        </div>
      </div>
    </div>
  )
}