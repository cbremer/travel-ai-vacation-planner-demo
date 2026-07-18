import type { TripDay } from '../types/trip'
import { getTrip } from './tripData'

export function getTodayDayIndex(now = new Date()): number | null {
  const trip = getTrip()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: trip.meta.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const today = formatter.format(now)
  const day = trip.days.find((d) => d.isoDate === today)
  return day?.index ?? null
}

export function getDayByIndex(index: number): TripDay | undefined {
  return getTrip().days.find((d) => d.index === index)
}

export function formatTripDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isWeekend(index: number): boolean {
  return getTrip().calendar.weekends.includes(index)
}

function daysBetween(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split('-').map(Number)
  const [ty, tm, td] = toIso.split('-').map(Number)
  const from = Date.UTC(fy, fm - 1, fd)
  const to = Date.UTC(ty, tm - 1, td)
  return Math.round((to - from) / (1000 * 60 * 60 * 24))
}

export function getTripPhase(now = new Date()):
  | { phase: 'before'; daysUntil: number }
  | { phase: 'today-eve'; daysUntil: 1 }
  | { phase: 'during'; dayIndex: number }
  | { phase: 'after' } {
  const trip = getTrip()
  const todayIndex = getTodayDayIndex(now)
  if (todayIndex !== null) return { phase: 'during', dayIndex: todayIndex }

  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: trip.meta.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const today = fmt.format(now)
  if (today > trip.meta.endDate) return { phase: 'after' }

  const daysUntil = daysBetween(today, trip.meta.startDate)
  if (daysUntil === 1) return { phase: 'today-eve', daysUntil: 1 }
  return { phase: 'before', daysUntil }
}
