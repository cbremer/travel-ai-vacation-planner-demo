import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { TripProvider } from './lib/TripContext'
import './index.css'

normalizeHashRoute()
registerAppServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TripProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </TripProvider>
  </StrictMode>,
)

function normalizeHashRoute() {
  const route = routeFromPath(window.location.pathname)
  if (!route || window.location.hash) return

  const basePath = withTrailingSlash(window.location.pathname.slice(0, -route.length) || '/')
  const next = `${window.location.origin}${basePath}#${route}${window.location.search}`
  window.location.replace(next)
}

function withTrailingSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`
}

function routeFromPath(pathname: string) {
  const matches = pathname.match(/\/(info|timeline|trip|today|itinerary|parents|bookings)$/)
  if (matches) return `/${matches[1]}`

  const dayMatch = pathname.match(/\/day\/(\d+)$/)
  if (dayMatch) return `/day/${dayMatch[1]}`

  return null
}

function registerAppServiceWorker() {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      void updateSW(true)
    },
    onNeedReload() {
      window.location.reload()
    },
  })
}
