import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const rows = ['Hay','Oat','Wheat','Shit','Leather','Apples','Carrot','Wood','Steel','Sand','Straw','Flax'] as const

export default function ManagementPage() {
  const { t } = useTranslation()
  const [acc, setAcc] = useState<any>(null)
  const [vals, setVals] = useState<Record<string, string>>({})

  useEffect(() => {
    (async () => {
      const s = await window.api.state.get()
      const a = s.accounts[s.selected]
      setAcc(a)
    })()
  }, [])

  const rowsUi = useMemo(() => rows.map((r) => {
    const key = r as string
    return (
      <React.Fragment key={r}>
        <div className="text-right">{t('ManagmentPage' + (r === 'Apples' ? 'Apple' : r))}</div>
        <input className="w-28" value={vals[key] || ''} onChange={e=>setVals(v=>({ ...v, [key]: e.target.value }))} />
        <button onClick={()=>{/* wired in main via dedicated buy command in future */}}>{t('ManagmentPageBuyBtn')}</button>
        <button onClick={()=>{/* wired in main via dedicated sell command in future */}}>{t('ManagmentPageSellBtn')}</button>
        <div />
      </React.Fragment>
    )
  }), [vals])

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="text-center text-lg">{acc?.Login || ''}</div>
      <div className="text-center">{t('ManagmentPageEqu')}: {acc?.Equ ?? 0}</div>
      <div className="grid grid-cols-5 gap-2 mt-6">
        <div className="font-semibold">&nbsp;</div>
        <div className="font-semibold">&nbsp;</div>
        <div className="font-semibold">&nbsp;</div>
        <div className="font-semibold">&nbsp;</div>
        <div className="font-semibold">&nbsp;</div>
        {rowsUi}
      </div>
      <div className="flex justify-center mt-4"><button className="w-28 h-8" onClick={()=>window.location.assign('/')}>{t('ManagmentPageReturnBtn')}</button></div>
    </div>
  )
}