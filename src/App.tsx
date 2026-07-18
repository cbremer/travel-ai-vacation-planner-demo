import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { DayPage } from './pages/DayPage'
import { TripInfoPage } from './pages/TripInfoPage'
import { TimelinePage } from './pages/TimelinePage'

const NAV = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/timeline', label: 'Timeline', icon: '📅', end: false },
  { to: '/info', label: 'Trip info', icon: '📋', end: false },
] as const

function Layout() {
  const location = useLocation()
  const onDay = location.pathname.startsWith('/day/')

  return (
    <div className="app">
      <header className="app-bar">
        {onDay && (
          <NavLink to="/" className="app-bar-back" aria-label="Home">
            <span aria-hidden>←</span> Home
          </NavLink>
        )}
        <div className="app-bar-title">
          {onDay ? 'Day details' : 'Demo Trip'}
        </div>
        {!onDay && <div className="app-bar-sub">Synthetic showcase data</div>}
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="Main">
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `bottom-nav-link ${isActive && !onDay ? 'bottom-nav-link--active' : ''}`
            }
          >
            <span className="bottom-nav-icon" aria-hidden>{icon}</span>
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="day/:index" element={<DayPage />} />
        <Route path="info" element={<TripInfoPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        {/* Legacy redirects */}
        <Route path="trip" element={<Navigate to="/" replace />} />
        <Route path="today" element={<Navigate to="/" replace />} />
        <Route path="itinerary" element={<Navigate to="/" replace />} />
        <Route path="parents" element={<Navigate to="/info" replace />} />
        <Route path="bookings" element={<Navigate to="/info" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
