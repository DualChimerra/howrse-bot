import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import i18n from './i18n'

export default function App() {
  const { pathname } = useLocation()
  const [flag, setFlag] = React.useState<string>('')
  React.useEffect(() => { (async () => { const s = await window.api.state.get(); const isRu = (s.globalSettings?.Localization ?? 0) === 0; const img = await window.api.resources.get(isRu ? 'ruFlag' : 'usaFlag'); setFlag(img||'') })() }, [])
  const toggleLang = async () => {
    const state = await window.api.state.get()
    const current = state.globalSettings?.Localization ?? 0
    const next = current === 0 ? 1 : 0
    await window.api.globals.update({ Localization: next })
    i18n.changeLanguage(next === 0 ? 'ru' : 'en')
    const img = await window.api.resources.get(next === 0 ? 'ruFlag' : 'usaFlag')
    setFlag(img||'')
  }
  const [logo, setLogo] = React.useState<string>('')
  React.useEffect(() => { (async () => { const img = await window.api.resources.get('logo'); setLogo(img||'') })() }, [])
  return (
    <div className="h-full flex flex-col">
      <div className="h-10 flex items-center justify-between px-2 select-none bg-[#202225]" style={{ WebkitAppRegion: 'drag' }}>
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
          {logo ? <img src={logo} alt="logo" className="w-5 h-5 rounded-sm" /> : <div className="w-5 h-5 bg-white/10 rounded-sm" />}
          <button className="px-1 py-0.5 text-xs" onClick={()=>{ /* open side menu already in page */ }}>
            ☰
          </button>
          <button className="px-1 py-0.5 text-xs" onClick={()=> window.location.assign('/settings')}>
            ⚙
          </button>
          <button className="px-1 py-0.5 text-xs" onClick={toggleLang}>
            {flag ? <img src={flag} alt="lang" className="w-5 h-5" /> : '🌐'}
          </button>
        </div>
        <div className="text-sm text-white">Bot Qually</div>
        <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
          <button className="w-6 h-6 hover:bg-white/10 rounded" onClick={()=>window.api.window.minimize()}>─</button>
          <button className="w-6 h-6 hover:bg-white/10 rounded" onClick={()=>window.api.window.maximize()}>▢</button>
          <button className="w-6 h-6 hover:bg-red-600 rounded" onClick={()=>window.api.window.close()}>✕</button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 pb-2 border-b border-gray-700" style={{ WebkitAppRegion: 'no-drag' }}>
        <NavLink to="/">Main</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/login-co">LoginCo</NavLink>
        <NavLink to="/management">Management</NavLink>
        <NavLink to="/status">Status</NavLink>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <Outlet />
      </div>
    </div>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link to={to} className={`px-3 py-1 rounded-md ${active ? 'bg-accent/30' : 'hover:bg-accent/10'}`}>{children}</Link>
  )
}