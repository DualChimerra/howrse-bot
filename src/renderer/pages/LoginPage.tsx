import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="text-lg font-semibold">{t('LoginPageLoginText')}</div>
        <input />
        <div className="text-lg font-semibold">{t('LoginPagePasswordText')}</div>
        <input type="password" />
        <label className="flex items-center gap-2"><input type="checkbox" /> {t('LoginPageSavedAccountsText')}</label>
        <hr />
        <div className="text-lg font-semibold">{t('LoginPageProxyText')}</div>
        <div className="text-sm">IP</div>
        <input />
        <div className="text-sm">{t('LoginPageProxyLoginText')}</div>
        <input />
        <div className="text-sm">{t('LoginPageProxyPasswordText')}</div>
        <input />
        <hr />
        <div className="text-lg font-semibold">{t('LoginPageServerText')}</div>
        <select>
          {['Australia','England','Arabic','Bulgaria','International','Spain','Canada','Germany','Norway','Poland','Russia','Romain','USA','FranceOuranos','FranceGaia','Sweden'].map(s => (
            <option key={s} value={s}>{t('Server' + s)}</option>
          ))}
        </select>
        <button className="mt-4 h-12 text-lg">{t('LoginPageLoginBtn')}</button>
      </div>
      <div>
        <div className="text-lg font-semibold mb-2">{t('LoginPageSavedAccountsText')}</div>
        <div className="bg-card rounded-xl h-80"></div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button>{t('LoginPageDeleteBtn')}</button>
          <button>{t('LoginPageClearBtn')}</button>
        </div>
      </div>
    </div>
  )
}