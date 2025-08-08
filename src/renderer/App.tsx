import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function App() {
  const { pathname } = useLocation()
  return (
    <div className="h-full flex flex-col">
      <div className="h-10 flex items-center px-3 select-none" style={{ WebkitAppRegion: 'drag' }}>
        <div className="font-semibold">Howrse Bot</div>
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