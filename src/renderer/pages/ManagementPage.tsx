import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const rows = ['Hay','Oat','Wheat','Shit','Leather','Apples','Carrot','Wood','Steel','Sand','Straw','Flax'] as const

export default function ManagementPage() {
  const { t } = useTranslation()
  const [acc, setAcc] = useState<any>(null)
  const [vals, setVals] = useState<Record<string, string>>({})
  const [selectedIdx, setSelectedIdx] = useState<number>(-1)

  useEffect(() => {
    (async () => {
      const s = await window.api.state.get()
      const a = s.accounts[s.selected]
      setAcc(a)
      setSelectedIdx(s.selected)
    })()
  }, [])

  const refresh = async () => { const s = await window.api.state.get(); setAcc(s.accounts[s.selected]) }

  const productTypeIndex = (key: string) => {
    // ProductType enum indices must match TS enum order used in main logic; we map by array order here for simplicity
    const order = ['Hay','Oat','Wheat','Shit','Leather','Apples','Carrot','Wood','Steel','Sand','Straw','Flax','OR']
    return order.indexOf(key)
  }

  const onBuy = async (key: string) => { if (selectedIdx<0) return; await window.api.products.buy(selectedIdx, productTypeIndex(key), vals[key]||'0'); await refresh() }
  const onSell = async (key: string) => { if (selectedIdx<0) return; await window.api.products.sell(selectedIdx, productTypeIndex(key), vals[key]||'0'); await refresh() }

  const rowsUi = useMemo(() => rows.map((r) => {
    const key = r as string
    return (
      <React.Fragment key={r}>
        <div className="text-right">{t('ManagmentPage' + (r === 'Apples' ? 'Apple' : r))}</div>
        <input className="w-28" value={vals[key] || ''} onChange={e=>setVals(v=>({ ...v, [key]: e.target.value }))} />
        <button onClick={()=>onBuy(key)}>{t('ManagmentPageBuyBtn')}</button>
        <button onClick={()=>onSell(key)}>{t('ManagmentPageSellBtn')}</button>
        <div />
      </React.Fragment>
    )
  }), [vals, selectedIdx])

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