import React from 'react'
import { useTranslation } from 'react-i18next'

const rows = ['Hay','Oat','Wheat','Shit','Leather','Apple','Carrot','Wood','Steel','Sand','Straw','Flax'] as const

export default function ManagementPage() {
  const { t } = useTranslation()
  return (
    <div className="bg-card rounded-xl p-4">
      <div className="text-center text-lg">login</div>
      <div className="text-center">{t('ManagmentPageEqu')}: 0</div>
      <div className="grid grid-cols-5 gap-2 mt-6">
        <div className="font-semibold">&nbsp;</div>
        <div className="font-semibold">&nbsp;</div>
        <div className="font-semibold">&nbsp;</div>
        <div className="font-semibold">&nbsp;</div>
        <div className="font-semibold">&nbsp;</div>
        {rows.map((r, i) => (
          <React.Fragment key={r}>
            <div className="text-right">{t('ManagmentPage' + r)}</div>
            <input className="w-28" />
            <button>{t('ManagmentPageBuyBtn')}</button>
            <button>{t('ManagmentPageSellBtn')}</button>
            <div />
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center mt-4"><button className="w-28 h-8">{t('ManagmentPageReturnBtn')}</button></div>
    </div>
  )
}