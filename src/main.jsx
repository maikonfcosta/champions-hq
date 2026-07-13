import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'
import './i18n'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Carregando...</div>}>
        <AuthProvider>
          <App />
          <Toaster position="bottom-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)
