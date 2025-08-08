import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LoginCoPage() {
  const { t } = useTranslation()
  return (
    <div className="bg-card rounded-xl p-4">
      <div className="h-52 bg-bg rounded-xl mb-4" />
      <div className="flex items-center justify-center gap-4">
        <button className="w-24 h-10">{t('LoginCoPageLoginBtn')}</button>
        <button className="w-24 h-10">{t('LoginCoPageCancelBtn')}</button>
      </div>
    </div>
  )
}