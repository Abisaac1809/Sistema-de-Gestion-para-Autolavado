import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')!
createRoot(rootElement).render(
  <StrictMode>
    <App />
    <Toaster richColors position="bottom-right" />
  </StrictMode>
)
