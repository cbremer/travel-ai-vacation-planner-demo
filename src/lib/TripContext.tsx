import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Trip } from '../types/trip'
import type { DayGuide } from '../types/dayGuide'
import { setTrip } from './tripData'
import { setGuide } from './dayGuide'

const BASE = import.meta.env.BASE_URL

async function fetchTripData(): Promise<{ trip: Trip; guide: DayGuide }> {
  const [tripRes, guideRes] = await Promise.all([
    fetch(`${BASE}data/trip.json`, { cache: 'no-store' }),
    fetch(`${BASE}data/day-guide.json`, { cache: 'no-store' }),
  ])
  if (!tripRes.ok) throw new Error(`Trip JSON ${tripRes.status}`)
  if (!guideRes.ok) throw new Error(`Guide JSON ${guideRes.status}`)
  return {
    trip: (await tripRes.json()) as Trip,
    guide: (await guideRes.json()) as DayGuide,
  }
}

interface TripContextValue {
  loaded: boolean
  error: string | null
  reload: () => void
}

const TripContext = createContext<TripContextValue>({
  loaded: false,
  error: null,
  reload: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export function useTripMeta() {
  return useContext(TripContext)
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const loadedRef = useRef(false)

  const load = async () => {
    try {
      const { trip, guide } = await fetchTripData()
      setTrip(trip)
      setGuide(guide)
      setError(null)
      if (!loadedRef.current) {
        loadedRef.current = true
        setLoaded(true)
      } else {
        setRefreshKey((k) => k + 1)
      }
    } catch (e) {
      setError(String(e))
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(load, 0)
    const iv = setInterval(load, 60_000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearTimeout(initialLoad)
      clearInterval(iv)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  if (!loaded) {
    if (error) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100dvh',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            color: '#ef4444',
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            <div>Error loading trip data</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>
              {error}
            </div>
            <button
              onClick={load}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )
    }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100dvh',
          fontFamily: 'system-ui, sans-serif',
          color: '#6b7280',
          gap: '0.75rem',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>🧳</span>
        <span>Loading trip…</span>
      </div>
    )
  }

  return (
    <TripContext.Provider value={{ loaded, error, reload: load }}>
      <div key={refreshKey} style={{ display: 'contents' }}>
        {children}
      </div>
    </TripContext.Provider>
  )
}
