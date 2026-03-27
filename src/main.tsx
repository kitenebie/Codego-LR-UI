import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './components/ui/notification.tsx'
import App from './App.tsx'
import './index.css'
import 'leaflet/dist/leaflet.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider position="bottom-right">
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
