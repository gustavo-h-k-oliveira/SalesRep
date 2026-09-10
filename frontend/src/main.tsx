import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const base = import.meta.env.BASE_URL || '/sagra-analytics/'
if (window.location.pathname === '/' || window.location.pathname === '') {
  window.location.replace(base)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
