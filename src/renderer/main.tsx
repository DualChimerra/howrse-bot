import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n/index'
import App from './App'
import MainPage from './pages/MainPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import LoginCoPage from './pages/LoginCoPage'
import ManagementPage from './pages/ManagementPage'
import StatusPage from './pages/StatusPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'login-co', element: <LoginCoPage /> },
      { path: 'management', element: <ManagementPage /> },
      { path: 'status', element: <StatusPage /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)