import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/features/auth/context/auth-context' // 🔥 Import Provider
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* 🔥 Wrap App */}
      <App />
    </AuthProvider>
  </StrictMode>,
)