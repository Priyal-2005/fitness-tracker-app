import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ── PWA service worker registration ──────────────────────────────────────────
// This import is provided by vite-plugin-pwa at build time.
// It is a no-op in dev mode, activates fully after `npm run build`.
import { registerSW } from 'virtual:pwa-register'

registerSW({
  // Called when a new service worker is available (app updated)
  onNeedRefresh() {
    // Silent auto-update — no prompt needed for a personal app
    // If you want to prompt: window.confirm("Update available. Reload?") && window.location.reload()
  },
  // Called when app is ready to work fully offline
  onOfflineReady() {
    console.log('App is ready to work offline')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)